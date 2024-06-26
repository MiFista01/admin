import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { environment } from '@config';
import { RequestsService } from '@services/admin/requests.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  link = "/admin"
  constructor(
    private router: Router,
    private req: RequestsService
  ) { }
  ngOnInit() {
    if(this.router.url == "/admin" || this.router.url == "/admin/login"){
      this.link = "/admin"
    }else{
      this.link = "/admin/dashboard"
    }
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if(event.url == "/admin" || event.url == "/admin/login"){
        this.link = "/admin"
      }else{
        this.link = "/admin/dashboard"
      }
    });
  }
  logOut() {
    this.req.Post(`${environment.apiUrl}/users/logout`, {}).subscribe({
      next: () => {
        this.router.navigate(['admin/login']);
      },
      error: (err) => { }
    })

  }
}
