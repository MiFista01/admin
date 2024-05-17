import { CommonModule } from '@angular/common';
import { Component, Type, ViewChild, ViewContainerRef, afterRender, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagsComponent } from '../tags/tags.component';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
interface schema {
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
  updatedAt: string
}
@Component({
  selector: 'app-head',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss'
})
export class HeadComponent {
  Bootstrap: any;
  seo: any;
  tagName: string = "";
  modalWindowName = "";
  openTab:string = "files"
  mainSchema: schema = {
    head: {
      js: [],
      css: [],
      title: "",
      description: "",
      tags: []
    }
  }
  css: headFile[] = []
  allCss: headFile[] = []
  js: headFile[] = []
  allJs: headFile[] = []
  @ViewChild("tagsContainer", { read: ViewContainerRef })
  container!: ViewContainerRef

  constructor(private req:RequestsService) {}
  ngOnInit() {
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/main`, true).subscribe((data) => {
      this.mainSchema = data
      this.req.Get<[any, headFile[]]>(`${environment.apiUrl}/files/css`).subscribe(data => {
        this.allCss = data[1]
        this.css = []
        for (const i of data[1]) {
          if (this.mainSchema.head.css.includes(i.fileName)) {
            this.css.push(i)
          }
        }
      })
      this.req.Get<[any, headFile[]]>(`${environment.apiUrl}/files/js`).subscribe(data => {
        this.allJs = data[1]
        this.js = []
        for (const i of data[1]) {
          if (this.mainSchema.head.js.includes(i.fileName)) {
            this.js.push(i)
          }
        }
      })
    })
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
      this.mainSchema.head.css.push(item.fileName)
    } else {
      this.js.push({ ...item })
      this.allJs.splice(idRemove, 1)
      this.mainSchema.head.js.push(item.fileName)
    }
  }
  returnFile(dir: "js" | "css", item: headFile, idRemove: number) {
    if (dir == "css") {
      if (!this.allCss.some(value => value.aliasName == item.aliasName))
        this.allCss.push({ ...item })
      this.css.splice(idRemove, 1)
      const cssIndex = this.mainSchema.head.css.indexOf(item.fileName)
      this.mainSchema.head.css.splice(cssIndex, 1)
    } else {
      if (!this.allJs.some(value => value.aliasName == item.aliasName))
        this.allJs.push({ ...item })
      this.js.splice(idRemove, 1)
      const jsIndex = this.mainSchema.head.css.indexOf(item.fileName)
      this.mainSchema.head.js.splice(jsIndex, 1)
    }
  }
  changeTitle(e:any){
    this.mainSchema.head.title = e.target.value
  }
  changeDes(e:any){
    this.mainSchema.head.description = e.target.value
  }
  addTag(e:any) {
    if (this.tagName != "" && !this.mainSchema.head.tags.includes(this.tagName)) {
      this.mainSchema.head.tags.push(this.tagName)
      this.tagName = ""
    }
  }
  deleteTag(name: string) {
    const index = this.mainSchema.head.tags.indexOf(name)
    this.mainSchema.head.tags.splice(index, 1)
  }
  updateMainHead() {
    console.log(this.mainSchema)
    this.req.Patch<schema>(`${environment.apiUrl}/pages/schema/main`, this.mainSchema).subscribe(data => {
      console.log(data)
    })
  }
}
