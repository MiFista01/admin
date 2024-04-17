import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'app/header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterModule, AsideComponent, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(private router: Router){}
  toggleAside(){
    const currentRoute = this.router.url;
    if (currentRoute.length == 6 && currentRoute.substring(0,6) === '/admin') {
      return false;
    } else {
      return true;
    }
  }
}
