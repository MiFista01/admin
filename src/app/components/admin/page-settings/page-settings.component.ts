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
interface pageShema {
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
  pageShema: pageShema = {
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
  modalWindowName = ''
  constructor(
    private route: ActivatedRoute,
    private req: RequestsService,
    @Inject(DOCUMENT) private document: any
  ) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const pageName = params.get('pageName');
      this.req.Get<page[]>(`${environment.apiUrl}/pages`).subscribe((data) => {
        this.pageObj = data.filter(value => value.pageName == pageName)[0]
      })
      this.req.Get<pageShema>(`${environment.apiUrl}/pages/schema/${pageName}`).subscribe((data) => {
        this.pageShema = data
        this.req.Get<[any, headFile[]]>(`${environment.apiUrl}/files/css`).subscribe(data => {
          this.allCss = data[1]
          this.css = []
          for (const i of data[1]) {
            if (this.pageShema.head.css.includes(i.fileName)) {
              this.css.push(i)
            }
          }
        })
        this.req.Get<[any, headFile[]]>(`${environment.apiUrl}/files/js`).subscribe(data => {
          this.allJs = data[1]
          this.js = []
          for (const i of data[1]) {
            if (this.pageShema.head.js.includes(i.fileName)) {
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
          this.pageObj.pageImg = data.pageImg
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
    console.log(this.allCss)
  }
  hideWindow() {
    this.modalWindowName = ""
  }
  appendFile(dir: "js" | "css", item: headFile, idRemove: number) {
    if (dir == "css") {
      this.css.push({ ...item })
      this.allCss.splice(idRemove, 1)
      this.pageShema.head.css.push(item.fileName)
    } else {
      this.js.push({ ...item })
      this.allJs.splice(idRemove, 1)
      this.pageShema.head.js.push(item.fileName)
    }
  }
  returnFile(dir: "js" | "css", item: headFile, idRemove: number) {
    if (dir == "css") {
      if (!this.allCss.some(value => value.aliasName == item.aliasName))
        this.allCss.push({ ...item })
      this.css.splice(idRemove, 1)
      const cssIndex = this.pageShema.head.css.indexOf(item.fileName)
      this.pageShema.head.css.splice(cssIndex, 1)
    } else {
      if (!this.allJs.some(value => value.aliasName == item.aliasName))
        this.allJs.push({ ...item })
      this.js.splice(idRemove, 1)
      const jsIndex = this.pageShema.head.css.indexOf(item.fileName)
      this.pageShema.head.js.splice(jsIndex, 1)
    }
  }
  updatePageTitle(e: any) {
    this.pageShema.head.title = e.target.value
  }
  updatePageDes(e: any) {
    this.pageShema.head.description = e.target.value
  }
  appendTags(e: any) {
    this.pageShema.head.tags.push(e.target.value)
    e.target.value = ""
  }
  removeTags(idRemove: number) {
    this.pageShema.head.tags.splice(idRemove, 1)
  }
  updatePageHead() {
    if (this.pageObj.id != 0) {
      this.req.Patch<pageShema>(`${environment.apiUrl}/pages/schema/${this.pageObj.id}`, this.pageShema).subscribe(data => {
        console.log(data)
      })
    }
  }

}
