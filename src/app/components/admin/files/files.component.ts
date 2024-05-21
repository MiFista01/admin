import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from "@config"
import { VideoComponent } from '../video/video.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

interface Folder {
  id: number
  name: string,
  main: boolean
  createdAt: string
  updatedAt: string
}
interface File {
  id?: number
  aliasName: string,
  fileName: string,
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
    VideoComponent,
    MonacoEditorModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {
  editorOptionsCSS = {theme: "myCustomTheme", language: 'css', wordWrap: 'on'};
  editorOptionsJS = {theme: "myCustomTheme", language: 'javascript', wordWrap: 'on'};

  @ViewChild('search', { static: false }) searchInput!: ElementRef;

  showFiles: File[] = []
  allFiles: File[] = []
  showFolders: Folder[] = []
  allFolders: Folder[] = []

  editorContent = ""
  dirName = ""
  mediaShowPath = ""
  videoSrc = ""
  fileName = ""

  showMediaPathStatus = false
  imgPreviewStatus = false
  uploadStatus = false
  selectedDir = false
  toggleFolderInput = false
  showEditorStatus = false
  updateCodeSTatus = false
  constructor(
    private req: RequestsService,
  ) { }

  showEditor(fileName: string) {
    this.req.Get<string>(`${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${fileName}`, false, "text").subscribe(data => {
      this.editorContent = data
      this.showEditorStatus = true
      this.fileName = fileName 
    })
  }
  hideEditor() {
    this.showEditorStatus = false
  }
  updateCode(){
    this.req.Patch(`${environment.apiUrl}/files/content/${this.dirName}/${this.fileName}`, {content:this.editorContent}).subscribe(data=>{
      if(data){
        this.updateCodeSTatus = true
        setTimeout(() => {
          this.updateCodeSTatus = false
        }, 1000);
      }
    })
  }
  searchFiles(e: any) {
    const inputValue = e.target.value
    this.showFiles = this.allFiles.filter(value => {
      return value.aliasName.includes(inputValue) || value.createdAt.includes(inputValue) || value.updatedAt.includes(inputValue)
    }).map((item, index) => {
      return { ...item, path: `${environment.apiUrl}/static/${this.dirName.replace("-", "/")}/${item.fileName}` };
    });
  }
  changeFilesDirs(dir: string, main = true) {
    const oldDirName = this.dirName
    this.selectedDir = false
    setTimeout(() => {
      if (dir != this.dirName) {
        if (main) {
          this.dirName = dir
        } else {
          this.dirName += "-" + dir
        }
      } else {
        this.dirName = ''
      }
      if (this.dirName != "") this.getAllFilesDirs()
      this.searchInput.nativeElement.value = ""
      this.imgPreviewStatus = this.dirName.includes('imgs-uploads') || this.dirName.includes('imgs-swipers')
    }, oldDirName == "" ? 0 : 500);
  }
  getAllFilesDirs() {
    this.req.Get<[Folder[], File[]]>(`${environment.apiUrl}/files/${this.dirName}`, true).subscribe(data => {
      this.showFolders = [...data[0]]
      this.allFolders = [...data[0]]

      this.showFiles = data[1].map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${item.fileName}` };
      });
      this.allFiles = data[1].map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${item.fileName}` };
      });
      this.selectedDir = true
    })
  }
  createImageFile(e: any) {
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
        let formData: FormData = new FormData();
        formData.append('uploadImage', file, file.name)
        formData.append("fileResolution", `${width}x${height}`)
        formData.append("fileSize", String(file.size))
        this.req.Post<File>(`${environment.apiUrl}/files/${this.dirName}`, formData).subscribe(data => {
          this.showFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${data.fileName}` })
          this.allFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${data.fileName}` })
          if (i == fileList.length - 1) {
            this.uploadStatus = false
          }
        })
      };
    }
  }
  createOtherFile(e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    this.uploadStatus = true
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      let formData: FormData = new FormData();
      formData.append('uploadImage', file, file.name)
      formData.append("fileSize", String(file.size))
      this.req.Post<File>(`${environment.apiUrl}/files/${this.dirName}`, formData).subscribe(data => {
        this.showFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${data.fileName}` })
        this.allFiles.push({ ...data, path: `${environment.apiUrl}/static/${this.dirName.replaceAll("-", "/")}/${data.fileName}` })
        if (i == fileList.length - 1) {
          this.uploadStatus = false
        }
      })
    }
  }
  changeFileName(e: any) {
    const currentName = e.target.getAttribute('currentName')
    const renamedFile = `${e.target.value}.${currentName.split('.').pop()}`
    this.req.Patch<File | null>(`${environment.apiUrl}/files/${this.dirName}`, { currentName, renamedFile }).subscribe(data => {
      if (data) {
        const editingElement = this.allFiles.filter(value => value.fileName == data.fileName)[0]
        editingElement.aliasName = data.aliasName
        editingElement.updatedAt = data.updatedAt
        const showEditingElement = this.showFiles.filter(value => value.fileName == data.fileName)[0]
        showEditingElement.aliasName = data.aliasName
        showEditingElement.updatedAt = data.updatedAt
        e.target.style.color = "darkgreen"
        setTimeout(() => {
          e.target.style.color = ""
        }, 600);
      } else {
        e.target.style.color = "darkred"
        setTimeout(() => {
          e.target.style.color = ""
        }, 600);
      }
    })
  }
  deleteFile(id: number | undefined) {
    if (id) {
      this.req.Delete(`${environment.apiUrl}/files/${this.dirName}/${id}`).subscribe(data => {
        if (data) {
          const indexShow = this.showFiles.findIndex(obj => obj.id === id);
          const indexAll = this.allFiles.findIndex(obj => obj.id === id);
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
  toggleFolderForm() {
    this.toggleFolderInput = !this.toggleFolderInput
  }
  createFolder(e: any) {
    this.req.Post<Folder>(`${environment.apiUrl}/files/folder/${this.dirName}`, { name: e.target.value }).subscribe(data => {
      if (data) {
        this.showFolders.push(data)
        this.allFolders.push(data)
        e.target.value = ""
        this.toggleFolderInput = false
      } else {
        e.target.style.color = "red"
        setTimeout(() => {
          e.target.style.color = ""
        }, 600);
      }
    })
  }
  getFolderName(item: Folder): string {
    if (item.name) {
      const parts = item.name.split('-');
      if (parts.length > 0) {
        return parts.pop()!;
      }
    }
    return '';
  }
  deleteFolder(id: number | undefined) {
    if (id) {
      this.req.Delete(`${environment.apiUrl}/files/folder/${id}`).subscribe(data => {
        const indexShow = this.showFolders.findIndex(obj => obj.id === id);
        const indexAll = this.allFolders.findIndex(obj => obj.id === id);
        if (indexShow !== -1) {
          this.showFolders.splice(indexShow, 1)
        }
        if (indexAll !== -1) {
          this.allFolders.splice(indexAll, 1);
        }
      })
    }
  }
  showWindow(path: string) {
    if (this.dirName == "imgs-uploads" || this.dirName.includes("imgs-swipers") || this.dirName == "videos" && this.mediaShowPath == "") {
      this.videoSrc = path
      this.mediaShowPath = path
      setTimeout(() => {
        this.showMediaPathStatus = true
      }, 400);
    }
  }
  hideWindow() {
    this.showMediaPathStatus = false
    setTimeout(() => {
      this.mediaShowPath = ""
      this.videoSrc = ""
    }, 500);
  }
}
