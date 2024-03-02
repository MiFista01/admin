import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  link = "/"
  constructor(private router: Router) {}
  ChangerHome(){
    const currentRoute = this.router.url;
    if (currentRoute.substring(0,6) !== '/admin') {
      this.link = "/"
      return false;
    } else {
      this.link = "/admin"
      return true;
    }
  }
}
