import { Component } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  focusedItem: string | null = "dashboard"
  constructor(private router: Router) {
    let routes = this.router.url.split("/")
    this.focusedItem = routes[routes.length-1]
  }
  ChangeFocus(item:string){
    this.focusedItem = item;
  }

}
