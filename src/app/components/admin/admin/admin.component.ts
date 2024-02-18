import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterModule, AsideComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
