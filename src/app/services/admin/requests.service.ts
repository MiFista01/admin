import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private http: HttpClient) { }
  sendGetRequest(url:string){
    return this.http.get<any>(url, { withCredentials: true });
  }
  sendPostRequest(url:string, body:any){
    return this.http.post<any>(url, body, { withCredentials: true });
  }
  sendPatchRequest(url:string, body:any){
    return this.http.patch<any>(url, body, { withCredentials: true });
  }
  sendDeleteRequest(url:string){
    return this.http.delete<any>(url, { withCredentials: true });
  }
}
