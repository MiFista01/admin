import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RequestsService } from '@services/admin/requests.service';
import {environment} from "@config"
import { RouterModule } from '@angular/router';
interface template{
  id:number
  name:string
  createdAt: string
}
@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})

export class TemplatesComponent {
  showTemplates:template[] = []
  allTemplates:template[] = []
  toggleTemplateInput = false
  constructor(private req: RequestsService){}
  ngOnInit(){
    this.req.Get<template[]>(`${environment.apiUrl}/templates`).subscribe(data=>{
      this.showTemplates = [...data]
      this.allTemplates = [...data]
    })
  }
  toggleCreateInput(){
    this.toggleTemplateInput = !this.toggleTemplateInput
  }
  createTemplate(e:any){
    this.req.Post<template>(`${environment.apiUrl}/templates`, {name:e.target.value}).subscribe(data=>{
      if(data){
        this.showTemplates.push(data)
        this.allTemplates.push(data)
        e.target.value = ""
      }else{
        e.target.style.color = "darkred"
        setTimeout(() => {
          e.target.style.color = ""
        }, 500);
      }
    })
  }
  searchTemplate(e:any){
    this.showTemplates = this.allTemplates.filter(value=> value.name.includes(e.target.value))
  }
  removeTemplate(id:number, step:number){
    this.req.Delete<template>(`${environment.apiUrl}/templates/${id}`).subscribe(data=>{
      const showIndex = this.showTemplates.findIndex(value=>value.id==data.id)
      this.showTemplates.splice(showIndex,1)
      const allIndex = this.allTemplates.findIndex(value=>value.id==data.id)
      this.allTemplates.splice(allIndex,1)
    })
  }
}
