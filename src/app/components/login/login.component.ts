import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SquareComponent } from '../square/square.component';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SquareComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = ""
  password = ""
  wrongField = 0
  squaresItems = Array.from({length: 750}, (_, index) => index + 1);
  constructor(private req:RequestsService, private router: Router){}
  login(){
    this.req.Post(`${environment.apiUrl}/users/login`,{user:this.user, password: this.password}).subscribe((data)=>{
      if(data){
        this.router.navigate(["admin","dashboard"])
      }
    },
    error => {
      this.wrongField = error.error.field
      console.log(error.error.field)
      setTimeout(() => {
        this.wrongField = 0
      }, 500);
  })
  }
}
