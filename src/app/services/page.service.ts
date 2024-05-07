import { Injectable } from '@angular/core';
import {environment} from "@config"
import { RequestsService } from './admin/requests.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private req:RequestsService) { }
  getPageSchema<T>(pageName:string){
    return 
  }
}
