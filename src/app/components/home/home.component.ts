import { Component } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SquareComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  squaresItems = Array.from({length: 600}, (_, index) => index + 1);
}
