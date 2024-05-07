import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '@config';
import { RequestsService } from '@services/admin/requests.service';
import { CommonModule } from '@angular/common';
interface log {
  url: string
  method: string
  route?: string
  name?: string
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  wishes: any;
  constructor(
    private fb: FormBuilder,
    private req: RequestsService
  ) {
    this.wishes = this.fb.group(
      { wish: ['', [Validators.required, Validators.minLength(50)]] })
  }
  pages = 0
  people = 0
  recorderedActions: log[] = []
  ngOnInit() {
    this.req.Get<log[]>(`${environment.apiUrl}/logger`).subscribe(data => {
      this.recorderedActions = data.map((value, index) => {
        if (value.url == "files" || value.url == "user" || value.url == "db" || value.url == "templates" || value.url == "pages" || value.url == "head-foot") {
          value.name = value.url
        } else {
          if (value.url?.split("/")[0] == "pages") {
            this.req.Get<any>(`${environment.apiUrl}/pages/${value.url?.split("/")[1]}`).subscribe(data => {
              if (value.url.includes("constructor")) {
                this.recorderedActions[index].name = data.pageName + " constructor"
              } else {
                this.recorderedActions[index].name = data.pageName + " settings"
              }
            })
          } else if (value.url?.split("/")[0] == "templates") {
            this.req.Get<any>(`${environment.apiUrl}/templates/${value.url?.split("/")[1]}`).subscribe(data => {
              const urlParts = value.url.split("/").filter(value => value != "")
              const numb = urlParts.pop()
              console.log(numb)
              if (!isNaN(Number(numb))) { this.recorderedActions[index].name = data.name + " constructor"}
            })
          }
        }

        return {
          ...value
        }
      })
    })
  }
  onSubmitWish() {

  }
}
