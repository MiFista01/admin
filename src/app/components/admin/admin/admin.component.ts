import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'app/header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterModule, AsideComponent, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  showAside = false
  focusedItem = ""
  constructor(private router: Router){
    router.events.subscribe(value=>{
      if(value instanceof NavigationEnd){
        const urlsParts = value.url.split("/")
        const startIndex = urlsParts.indexOf("admin")
        this.showAside = startIndex < urlsParts.length-1 && !urlsParts.includes("login")
        this.focusedItem = urlsParts[startIndex+1]
      }
    })
  }
}
