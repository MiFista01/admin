import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { environment } from "@config"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestsService } from 'app/services/admin/requests.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  createrPages: FormGroup;
  host = ""
  showPages: any[] = []
  allPages: any[] = []
  pageNameFormToggle = false
  errorPageName = false
  updateDisable = false
  startCountUpdate = 0
  constructor(
    private req: RequestsService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: any
  ) {
    this.createrPages = this.fb.group({
      pageName: ['', [
        Validators.required,
        Validators.minLength(4)
      ]
      ]
    });
  }
  ngOnInit() {
    this.host = this.document.location.origin
    this.req.Get<any[]>(`${environment.apiUrl}/pages/`, true).subscribe(data => {
      this.showPages = [...data.map(page => {
        if (page.pageImg) {
          page.pageImg = `${environment.apiUrl}/static/pages/${page.pageImg}`
        }
        return { ...page }
      })]
      this.allPages = [...data.map(page => {
        if (page.pageImg) {
          page.pageImg = `${environment.apiUrl}/static/pages/${page.pageImg}`
        }
        return { ...page }
      })]
    })
  }
  searchPages(e: any) {
    if (e.target.value.length > 0) {
      this.showPages = this.allPages.filter(page => page.pageName.includes(e.target.value));
    } else {
      this.showPages = this.allPages.slice(0, 12);
    }
  }
  togglePageNameForm() {
    this.pageNameFormToggle = !this.pageNameFormToggle
  }
  createPage() {
    if (!this.createrPages.controls["pageName"].value.includes("/")) {
      this.req.Post<any>(`${environment.apiUrl}/pages/`, { pageName: this.createrPages.controls["pageName"].value }).subscribe(data => {
        this.createrPages.controls["pageName"].value
        this.showPages.push(data)
        this.allPages.push(data)
      },
        error => {
          this.errorPageName = true
          setTimeout(() => {
            this.errorPageName = false
          }, 1000);
        })
    } else {
      this.errorPageName = true
      setTimeout(() => {
        this.errorPageName = false
      }, 1000);
    }
  }
  updateCardsSnapshot() {
    if (!this.updateDisable) {
      this.updateDisable = true
      this.startCountUpdate = 0
      for (const i of this.showPages) {
        this.req.Patch<any>(`${environment.apiUrl}/pages/snapshot/${i.id}`, { url: this.host + "/" + i.pageName }).subscribe(data => {
          i.pageImg = `${environment.apiUrl}/static/pages/${data.pageImg}`
          this.startCountUpdate += 1
          if(this.startCountUpdate == this.allPages.length-1){
            this.updateDisable = false
          }
        })
      }
    }
  }
  removePage(id: number, index: number) {
    this.req.Delete<any>(`${environment.apiUrl}/pages/${id}`).subscribe(data => {
      if (data) {
        this.showPages = this.showPages.filter((val, i, ar) => { return i != index })
        this.allPages = this.allPages.filter((val, i, ar) => { return i != index })
      }
    })
  }
}
