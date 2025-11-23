import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { WardMapping } from '../../models/ward-mapping.model';
import { catchError, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-admin-lookup',
  imports: [FormsModule, CommonModule, NgFor, NgIf],
  templateUrl: './administrative-lookup.html',
})
export class AdminLookupComponent implements OnInit {
  activeTab: 'old' | 'new' = 'old';

  provinces: string[] = [];
  districts: string[] = [];
  wards: string[] = [];

  selectedProvince = '';
  selectedDistrict = '';
  selectedWard = '';
  village = '';
  detailAddress = '';

  convertedAddress?: WardMapping;
  error?: string;
  loading = false;

  constructor(private addressService: AddressService) {}

  ngOnInit() {
    this.loadProvinces();
  }

  // Chuyển tab Old/New
  switchTab(tab: 'old' | 'new') {
    this.activeTab = tab;
  }

  // Reset form
  resetForm() {
    this.selectedProvince = '';
    this.selectedDistrict = '';
    this.selectedWard = '';
    this.village = '';
    this.detailAddress = '';
    this.convertedAddress = undefined;
    this.error = undefined;
    this.districts = [];
    this.wards = [];
  }

  // Load danh sách tỉnh
  loadProvinces() {
    this.addressService.getProvinces()
      .pipe(catchError(() => of([])))
      .subscribe((res: string[]) => this.provinces = res);
  }

  // Khi chọn tỉnh
  onProvinceChange() {
    this.selectedDistrict = '';
    this.selectedWard = '';
    this.wards = [];

    if (!this.selectedProvince) {
      this.districts = [];
      return;
    }

    this.addressService.getDistricts(this.selectedProvince)
      .pipe(catchError(() => of([])))
      .subscribe((res: string[]) => this.districts = res);
  }

  // Khi chọn quận/huyện
  onDistrictChange() {
    this.selectedWard = '';

    if (!this.selectedDistrict || !this.selectedProvince) {
      this.wards = [];
      return;
    }

    this.addressService.getWards(this.selectedDistrict, this.selectedProvince)
      .pipe(catchError(() => of([])))
      .subscribe((res: string[]) => this.wards = res);
  }

  // Submit form để tra cứu địa chỉ mới
  submitForm() {
    const oldAddressParts = [
      this.selectedWard,
      this.selectedDistrict,
      this.selectedProvince
    ].filter(Boolean);

    if (oldAddressParts.length < 3) {
      alert('Vui lòng chọn đầy đủ Phường/Xã, Quận/Huyện, Tỉnh/Thành phố');
      return;
    }

    const oldAddress = oldAddressParts.join(', ');

    this.loading = true;
    this.convertedAddress = undefined;
    this.error = undefined;

    this.addressService.convertAddress(oldAddress)
      .pipe(
        catchError(() => {
          this.error = 'Có lỗi xảy ra khi tra cứu';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(res => {
        this.convertedAddress = res ?? undefined;
        this.loading = false;
      });
  }
}
