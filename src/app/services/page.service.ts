import { Injectable } from '@angular/core';
import {environment} from "@config"
import { RequestsService } from './admin/requests.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private req:RequestsService) { }
  getPageSchema(pageName:string){
    return this.req.Get(`${environment.apiUrl}/pages/schema/${pageName}`)
  }
}
