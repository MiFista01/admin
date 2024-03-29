import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {environment} from "@config"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestsService } from 'app/services/admin/requests.service';
import { error } from 'console';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  createrPages: FormGroup;

  constructor(
    private req:RequestsService,
    private fb:FormBuilder,
    @Inject(DOCUMENT) private document: any
  ){
    this.createrPages = this.fb.group({
      pageName: ['',[
        Validators.required,
        Validators.minLength(4)
      ]
    ]});
  }
  host = ""
  showPages:any[] = []
  allPages:any[] = []
  pageNameFormToggle = false
  errorPageName = false
  ngOnInit(){
    this.host = this.document.location.origin
    this.req.sendGetRequest(`${environment.apiUrl}/pages/`).subscribe(data=>{
      for(const i of data){
        if(this.showPages.length < 12){
          this.showPages.push(i)
        }
        this.allPages.push(i)
      }
    })
  }
  togglePageNameForm(){
    this.pageNameFormToggle = !this.pageNameFormToggle
  }
  createPage(){
    this.req.sendPostRequest(`${environment.apiUrl}/pages/`,{pageName:this.createrPages.controls["pageName"].value}).subscribe(data=>{
      console.log(data)
      this.createrPages.controls["pageName"].value
    },
  error=>{
    this.errorPageName = true
    setTimeout(() => {
      this.errorPageName = false
    }, 1000);
  })
  }
  updateCardsSnapshot(){
    for(const i of this.showPages){
      this.req.sendPostRequest(`${environment.apiUrl}/pages/snapshot/${i.id}`,{url:this.host+"/"+i.pageName})
    }
  }
}
