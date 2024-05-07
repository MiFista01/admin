import { Component, Input } from '@angular/core';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestsService } from '@services/admin/requests.service';
import {environment} from "@config"
@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  pages = 0
  files = 0
  messages = 0
  user = 0
  templates = 0
  @Input() focusedItem: string | null = "dashboard"
  constructor(private router: Router, private req:RequestsService) {}
  ngOnInit(){
    this.req.Get<number>(`${environment.apiUrl}/pages/count`).subscribe(data=>{
      this.pages = data
    })
    this.req.Get<number>(`${environment.apiUrl}/templates/count`).subscribe(data=>{
      this.templates = data
    })
  }
}
