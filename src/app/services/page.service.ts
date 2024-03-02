import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {environment} from "../../config"

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }
  async getPageSchema(pageName:string){
    return await firstValueFrom(this.http.get(`${environment.apiUrl}/pages/schema/${pageName}`))
  }
}
