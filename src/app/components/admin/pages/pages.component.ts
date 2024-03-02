import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import {environment} from "../../../../config"

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any){}
  host = ""
  showPages:any[] = []
  allPages:any[] = []
  ngOnInit(){
    this.host = this.document.location.origin
    this.http.get<any[]>(`${environment.apiUrl}/pages/`).subscribe(data=>{
      for(const i of data){
        if(this.showPages.length < 12){
          this.showPages.push(i)
        }
        this.allPages.push(i)
      }
    })
  }
}
