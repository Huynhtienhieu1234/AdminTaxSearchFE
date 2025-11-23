import { Component, AfterViewInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

interface WardMapping {
  oldWardName?: string;
  oldDistrictName?: string;
  oldProvinceName?: string;
  newWardName?: string;
  newProvinceName?: string;
}

@Component({
  selector: 'app-map-lookup',
  templateUrl: './coordinate-search.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class MapLookupComponent implements AfterViewInit {

  private http = inject(HttpClient);

  showInput = false;
  converted?: WardMapping;
  loading = false;
  error?: string;

  latInput?: number;
  lonInput?: number;

  private locationIqKey = 'pk.193bab2670e05cc6250be5d8cd4ab5fb';

  ngAfterViewInit() {
    const map = L.map('map', {
      preferCanvas: true,
      maxBounds: [
        [8.18, 102.14],
        [23.40, 109.46]
      ],
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: false
    }).setView([16.047, 108.206], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 6,
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 300);

    map.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng.lat, e.latlng.lng);
    });
  }

  toggleInput() {
    this.showInput = !this.showInput;
  }

  searchByInput() {
    if (this.latInput != null && this.lonInput != null) {
      this.handleMapClick(this.latInput, this.lonInput);
    } else {
      this.error = 'Vui lòng nhập đầy đủ Lat và Lon';
    }
  }

  handleMapClick(lat: number, lon: number) {
    this.loading = true;
    this.error = undefined;
    this.converted = undefined;

    this.http.get<any>(
      `https://us1.locationiq.com/v1/reverse.php?key=${this.locationIqKey}&lat=${lat}&lon=${lon}&format=json`
    ).pipe(
      catchError(err => {
        this.error = 'Lỗi tra cứu LocationIQ';
        this.loading = false;
        return of(null);
      })
    ).subscribe(res => {
      if (!res?.address) {
        this.error = 'Không tìm thấy địa chỉ';
        this.loading = false;
        return;
      }

      const ward = res.address.road || res.address.suburb || res.address.village || res.address.town || '';
      const district = res.address.county || res.address.city_district || '';
      const province = res.address.state || '';

      if (!ward || !district || !province) {
        this.error = 'Không lấy đủ thông tin hành chính';
        this.loading = false;
        return;
      }

      this.http.get<WardMapping | null>(
        `https://localhost:7215/api/address/convert`, {
        params: {
          oldAddress: `${ward}, ${district}, ${province}`
        }
      }
      ).pipe(
        catchError(err => {
          this.error = 'Không tìm thấy địa chỉ mới';
          this.loading = false;
          return of(null);
        })
      ).subscribe(mapping => {
        if (mapping) {
          this.converted = mapping;
        } else {
          this.error = 'Không có dữ liệu chuyển đổi';
        }
        this.loading = false;
      });
    });
  }
}
