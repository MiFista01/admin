import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {environment} from "@config"
import { RequestsService } from './admin/requests.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private req:RequestsService) { }
  getPageSchema(pageName:string){
    try {
      return this.req.Get(`${environment.apiUrl}/pages/schema/${pageName}`)
    } catch (error) {
      return null
    }
  }
}
