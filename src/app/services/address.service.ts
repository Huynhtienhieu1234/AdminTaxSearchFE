import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WardMapping } from '../models/ward-mapping.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/address`; // URL backend

  // Lấy danh sách tỉnh/thành
  getProvinces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/provinces`);
  }

  // Lấy danh sách quận/huyện theo tỉnh/thành
  getDistricts(province: string): Observable<string[]> {
    const params = new HttpParams().set('province', province);
    return this.http.get<string[]>(`${this.apiUrl}/districts`, { params });
  }

  // Lấy danh sách phường/xã theo quận/huyện và tỉnh/thành
  getWards(district: string, province: string): Observable<string[]> {
    const params = new HttpParams()
      .set('district', district)
      .set('province', province);
    return this.http.get<string[]>(`${this.apiUrl}/wards`, { params });
  }
    reverseAndConvert(lat: number, lng: number): Observable<WardMapping | null> {
    return this.http.get<WardMapping | null>(`${this.apiUrl}/reverse-geocode`, {
      params: { lat: lat.toString(), lng: lng.toString() }
    });
  }

  convertAddress(oldAddress: string): Observable<WardMapping | null> {
    return this.http.get<WardMapping | null>(`${this.apiUrl}/convert`, {
      params: { oldAddress }
    });
  }
}
