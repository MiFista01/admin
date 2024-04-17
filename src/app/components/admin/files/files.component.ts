import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {environment} from "@config"
import { RequestsService } from '@services/admin/requests.service';

interface Folder{
  name:string,
  createdDate: string
  updatedDate: string
}
interface File{
  id?: number
  aliasName: string,
  fileName:string,
  createdAt: string
  updatedAt: string
  fileResolution: string
  fileSize: number
  path: string
}

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {
  showFiles: File[]= []
  allFiles: File[]= []
  showFolders: Folder[]= []
  allFolders: Folder[]= []
  dirName = ""
  imgPreviewStatus = false
  uploadStatus = false
  selectedDir = false
  config = {
    name: "javascript", json: true,
    value: "jjkh as dkjh ad"
  }
  constructor(
    private req:RequestsService,
  ){}
  searchFiles(e:any){
    const inputValue = e.target.value
    this.showFiles = this.allFiles.filter(value=> {
      return value.aliasName.includes(inputValue) || value.createdAt.includes(inputValue) || value.updatedAt.includes(inputValue)}).map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/${this.dirName.replace("-","/")}/${item.fileName}` }; 
      });
  }
  changeFilesDirs(dir:string){
    const oldDirName = this.dirName
    if(dir != this.dirName){
      this.dirName = dir
    }else{
      this.dirName = ''
    }
    this.selectedDir = false
    setTimeout(() => {
      if (this.dirName != "") this.getAllFilesDirs()
      this.imgPreviewStatus = this.dirName.includes('imgs-uploads') || this.dirName.includes('imgs-swipers')
    }, oldDirName == ""? 0: 500);
  }
  getAllFilesDirs(){
    this.req.Get<[Folder[],File[]]>(`${environment.apiUrl}/files/${this.dirName}`).subscribe(data=>{
      this.showFolders = data[0];
      this.allFolders = data[0];
      this.showFiles = data[1].map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/${this.dirName.replace("-","/")}/${item.fileName}` }; 
      });
      this.allFiles = data[1];
      this.selectedDir = true
    })
  }
  createImageFile(e:any){
    let fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    this.uploadStatus = true
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        let formData:FormData = new FormData();
        formData.append('uploadImage', file, file.name)
        formData.append("fileResolution", `${width}x${height}`)
        formData.append("fileSize", String(file.size))
        this.req.Post<File>(`${environment.apiUrl}/files/${this.dirName}`, formData).subscribe(data =>{
          this.showFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replace("-","/")}/${data.fileName}` })
          this.allFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replace("-","/")}/${data.fileName}` })
          if(i == fileList.length -1){
            this.uploadStatus = false
          }
        })
      };
    }
  }
  createOtherFile(e:any){
    let fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    this.uploadStatus = true
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      let formData:FormData = new FormData();
      formData.append('uploadImage', file, file.name)
      formData.append("fileSize", String(file.size))
      this.req.Post<File>(`${environment.apiUrl}/files/${this.dirName}`, formData).subscribe(data =>{
        this.showFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replace("-","/")}/${data.fileName}` })
        this.allFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replace("-","/")}/${data.fileName}` })
        if(i == fileList.length -1){
          this.uploadStatus = false
        }
      })
    }
  }
  changeFileName(e:any){
    const currentName = e.target.getAttribute('currentName')
    const renamedFile = `${e.target.value}.${currentName.split('.').pop()}`
    this.req.Patch<File | null>(`${environment.apiUrl}/files/${this.dirName}`,{currentName, renamedFile }).subscribe(data=>{
      if(data){
        const editingElement = this.allFiles.filter(value=> value.fileName == data.fileName)[0]
        editingElement.aliasName = data.aliasName
        editingElement.updatedAt = data.updatedAt
        const showEditingElement = this.showFiles.filter(value=> value.fileName == data.fileName)[0]
        showEditingElement.aliasName = data.aliasName
        showEditingElement.updatedAt = data.updatedAt
        e.target.style.color = "darkgreen"
        setTimeout(() => {
          e.target.style.color = "rgb(153, 102, 204)"
        }, 600);
      }else{
        e.target.style.color = "darkred"
        setTimeout(() => {
          e.target.style.color = "rgb(153, 102, 204)"
        }, 600);
      }
    })
  }
  deleteFile(id:number | undefined){
    if(id){
      this.req.Delete(`${environment.apiUrl}/files/${this.dirName}/${id}`).subscribe(data=>{
        if(data){
          const indexShow = this.showFiles.findIndex(obj => obj.id === id);
          const indexAll = this.showFiles.findIndex(obj => obj.id === id);
          if (indexShow !== -1) {
            this.showFiles.splice(indexShow, 1);
          }
          if (indexAll !== -1) {
            this.allFiles.splice(indexAll, 1);
          }
        }
      })
    }
  }
}
