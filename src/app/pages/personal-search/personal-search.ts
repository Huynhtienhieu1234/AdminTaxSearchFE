import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../services/search.service';
import { catchError, of } from 'rxjs';
import { ChatbotSearchComponent } from '../chatbot-search/chatbot-search';
import { TaxInfo } from '../../models/tax-info.model';

@Component({
  selector: 'app-personal-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatbotSearchComponent],
  templateUrl: './personal-search.html',
})
export class PersonalSearchComponent {
  query = ''; // gom Cccd + MST
  loading = false;
  result?: SearchResult;
  error?: string;

  editingAddress = false;
  newAddress = '';

  private searchService = inject(SearchService);

  // Chatbot UI
  chatOpen = false;
  chatInput = '';
  messages: string[] = [];

  @ViewChild(ChatbotSearchComponent) private chatbotLogic!: ChatbotSearchComponent;

  // Tra cứu Cccd/MST
  onSearch() {
    const q = this.query.trim();

    if (!q) {
      alert('Vui lòng nhập Cccd hoặc Mã số thuế!');
      return;
    }

    if (!(/^\d{12}$/.test(q) || /^\d{10}$/.test(q))) {
      alert('Cccd phải là 12 chữ số, MST phải là 10 chữ số!');
      return;
    }

    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.editingAddress = false;

    this.searchService.search(q)
      .pipe(catchError(err => {
        this.error = 'Có lỗi xảy ra';
        this.loading = false;
        return of(null);
      }))
      .subscribe(res => {
        this.result = res || undefined;
        this.loading = false;
        if (this.result?.data?.address) {
          this.newAddress = this.result.data.address;
        }
      });
  }

  toggleEditAddress() {
    this.editingAddress = !this.editingAddress;
    if (this.editingAddress && this.result?.data?.address) {
      this.newAddress = this.result.data.address;
    }
  }

  saveAddress() {
    if (!this.result || !this.result.data) return;

    const updatedAddress = this.newAddress.trim();
    if (!updatedAddress) {
      alert('Địa chỉ không được để trống!');
      return;
    }

    this.loading = true;

    this.searchService.updateAddress(this.result.data.taxId, updatedAddress)
      .pipe(catchError(err => {
        this.error = 'Có lỗi khi cập nhật địa chỉ';
        this.loading = false;
        return of(null);
      }))
      .subscribe(res => {
        if (res) {
          this.result!.data!.address = updatedAddress;
          this.editingAddress = false;
        }
        this.loading = false;
      });
  }

  // Chatbot
  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  sendMessage() {
  if (!this.chatInput.trim()) return;

  this.messages.push(`Bạn: ${this.chatInput.trim()}`);

  this.chatbotLogic.prompt = this.chatInput;

  this.chatbotLogic.result.subscribe((text: string) => {
    this.messages.push(`Ollama: ${text}`);
  });
  this.chatbotLogic.error.subscribe((err: string) => {
    this.messages.push(`❌ ${err}`);
  });

  this.chatbotLogic.sendMessage();
  this.chatInput = '';
}

}
