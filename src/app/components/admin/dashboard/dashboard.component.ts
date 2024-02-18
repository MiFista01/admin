import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  wishes:any;
  constructor(private fb: FormBuilder){
    this.wishes = this.fb.group(
      {wish:['', [Validators.required, Validators.minLength(50)]]})
  }
  pages = 0
  people = 0
  onSubmitWish(){

  }
}
