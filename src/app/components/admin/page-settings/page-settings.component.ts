import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from "@config"
import { RequestsService } from '@services/admin/requests.service';
interface page {
  id: number
  pageName: string
  pageImg: string
  popular: number
  createdAt: string
  updatedAt: string
}
interface pageSchema {
  head: {
    js: string[]
    css: string[]
    title: string
    description: string,
    tags: string[]
  }
}
interface headFile {
  aliasName: string,
  fileName: string
}
@Component({
  selector: 'app-page-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-settings.component.html',
  styleUrl: './page-settings.component.scss'
})
export class PageSettingsComponent {
  pageObj: page = {
    id: 0,
    pageName: "string",
    pageImg: "string",
    popular: 0,
    createdAt: "string",
    updatedAt: "string"
  }
  pageSchema: pageSchema = {
    head: {
      js: [],
      css: [],
      title: "",
      description: "",
      tags: []
    }
  }
  openTab = "files"
  css: headFile[] = []
  showCss: headFile[] = []
  allCss: headFile[] = []
  js: headFile[] = []
  showJs: headFile[] = []
  allJs: headFile[] = []
  updateImageStatus = false
  updated = false
  modalWindowName = ''
  constructor(
    private route: ActivatedRoute,
    private req: RequestsService,
    @Inject(DOCUMENT) private document: any
  ) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.req.Get<page>(`${environment.apiUrl}/pages/${id}`, true).subscribe((data) => {
        if (data.pageImg) {
          data.pageImg = `${environment.apiUrl}/static/pages/${data.pageImg}`
        }
        this.pageObj = data
      })
      this.req.Get<pageSchema>(`${environment.apiUrl}/pages/schema/${id}`).subscribe((data) => {
        this.pageSchema = data
        this.req.Get<[any, headFile[]]>(`${environment.apiUrl}/files/css`).subscribe(data => {
          this.allCss = data[1]
          this.css = []
          for (const i of data[1]) {
            if (this.pageSchema.head.css.includes(i.fileName)) {
              this.css.push(i)
            }
          }
        })
        this.req.Get<[any, headFile[]]>(`${environment.apiUrl}/files/js`).subscribe(data => {
          this.allJs = data[1]
          this.js = []
          for (const i of data[1]) {
            if (this.pageSchema.head.js.includes(i.fileName)) {
              this.js.push(i)
            }
          }
        })
      })
    });
  }
  updatePageSnapshot() {
    if (!this.updateImageStatus) {
      this.updateImageStatus = true
      setTimeout(() => {
        this.req.Patch<any>(`${environment.apiUrl}/pages/snapshot/${this.pageObj.id}`, { url: this.document.location.origin + "/" + this.pageObj.pageName }).subscribe(data => {
          this.pageObj.pageImg = ""
          this.pageObj.pageImg = `${environment.apiUrl}/static/pages/${data.pageImg}`
          this.updateImageStatus = false
        })
      }, 400);
    }
  }
  changeTab(tabName: string) {
    this.openTab = tabName
  }
  showFileModalWindow() {
    this.modalWindowName = "files"
  }
  hideWindow() {
    this.modalWindowName = ""
  }
  appendFile(dir: "js" | "css", item: headFile, idRemove: number) {
    if (dir == "css") {
      this.css.push({ ...item })
      this.allCss.splice(idRemove, 1)
      this.pageSchema.head.css.push(item.fileName)
    } else {
      this.js.push({ ...item })
      this.allJs.splice(idRemove, 1)
      this.pageSchema.head.js.push(item.fileName)
    }
  }
  returnFile(dir: "js" | "css", item: headFile, idRemove: number) {
    if (dir == "css") {
      if (!this.allCss.some(value => value.aliasName == item.aliasName))
        this.allCss.push({ ...item })
      this.css.splice(idRemove, 1)
      const cssIndex = this.pageSchema.head.css.indexOf(item.fileName)
      this.pageSchema.head.css.splice(cssIndex, 1)
    } else {
      if (!this.allJs.some(value => value.aliasName == item.aliasName))
        this.allJs.push({ ...item })
      this.js.splice(idRemove, 1)
      const jsIndex = this.pageSchema.head.css.indexOf(item.fileName)
      this.pageSchema.head.js.splice(jsIndex, 1)
    }
  }
  updatePageTitle(e: any) {
    this.pageSchema.head.title = e.target.value
  }
  updatePageDes(e: any) {
    this.pageSchema.head.description = e.target.value
  }
  appendTags(e: any) {
    this.pageSchema.head.tags.push(e.target.value)
    e.target.value = ""
  }
  removeTags(idRemove: number) {
    this.pageSchema.head.tags.splice(idRemove, 1)
  }
  updatePageHead() {
    if (this.pageObj.id != 0) {
      this.req.Patch<pageSchema>(`${environment.apiUrl}/pages/schema/${this.pageObj.id}`, this.pageSchema).subscribe(data => {
        this.updated = true
        setTimeout(() => {
          this.updated = false
        }, 500);
      })
    }
  }

}
