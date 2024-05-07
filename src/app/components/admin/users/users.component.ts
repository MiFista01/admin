import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '@config';
import { RequestsService } from '@services/admin/requests.service';

interface profile{
  name?:string
  email?:string
  password?:string
  first_name?:string
  last_name?:string
  phone?:string
  facebook_link?:string
  instagramm_link?:string
  github_link?:string
  itchio_link?:string
  google_link?:string
  imgPath?:string
  createdAt?:string
  updatedAt?:string
}
interface Img {
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
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  profile:profile = {}
  passwordType = "password"
  showStep = 1
  updateStatus = false
  modalWindowName = ""
  imgs:Img[] = []
  constructor(private req:RequestsService){}
  ngOnInit(){
    this.req.Get<profile>(`${environment.apiUrl}/users/1`, true).subscribe(data=>{
      this.profile = data
      this.profile.password = ""
    })
  }
  changeShowStep(stepId:number){
    this.showStep = stepId
  }
  changeProfuleFieldValue(e:any, field:string){
    (this.profile as any)[field] = e.target.value;
  }
  updateUserProfile(){
    this.req.Patch<any>(`${environment.apiUrl}/users/1`, this.profile).subscribe(data=>{
      if(data[0]){
        this.updateStatus = true
        this.profile.password = ""
        setTimeout(() => {
          this.updateStatus = false
        }, 1000);
      }
    })
  }
  returnModalWindow(){
    this.modalWindowName = ""
  }
  openWindowSelectImg(){
    this.req.Get<[any[], Img[]]>(`${environment.apiUrl}/files/imgs-uploads`).subscribe(data=>{
      this.imgs = data[1].map(value=>{
        return {
          ...value,
          path: `${environment.apiUrl}/static/imgs/uploads/${value.fileName}`
        }
      })
      this.modalWindowName = "selectImg"
    })
  }
  changeUserAvatar(src:string){
    this.req.Patch<any>(`${environment.apiUrl}/users/1`, {imgPath:src}).subscribe(data=>{
      if(data[0]){
        this.profile.imgPath = src
        this.modalWindowName = ""
      }
    })
  }
}
