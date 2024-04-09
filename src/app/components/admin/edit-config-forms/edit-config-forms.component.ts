import { Component, ElementRef, ViewChild } from '@angular/core';
import { RequestsService } from '@services/admin/requests.service';
import { ConstructorService } from '@services/constructor.service';
import {environment} from "@config"
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { CommonModule } from '@angular/common';
declare function emitSetImg(path:string): void;
declare function emitSetList(count:number): void;
declare function emitTitleType(type:string): void;
declare function emitBtnSrc(path:string): void;

interface style{
  optGroupName:string,
  group:{
    name:string,
    value:string,
    type:string,
    values?:string[]|undefined
  }[]
}
@Component({
  selector: 'app-edit-config-forms',
  standalone: true,
  imports: [
    CommonModule,
    UploadedGalleryComponent
  ],
  templateUrl: './edit-config-forms.component.html',
  styleUrl: './edit-config-forms.component.scss'
})
export class EditConfigFormsComponent {
  
  styles:style[] = []
  pages:string[] = []
  showStyleGroupArray:string[] = []
  selectedStyles:string[] = []
  isFlipped = false;
  galleryLength = 0
  @ViewChild('gallery', {static: true}) gallery!: UploadedGalleryComponent;

  constructor(
    private constructorService:ConstructorService,
    private req:RequestsService
  ){
    this.styles = constructorService.styles
  }
  ngOnInit(){
    this.gallery?.imagesLength$.subscribe(data=>{
      this.galleryLength = data
    })
    this.req.Get<[]>(`${environment.apiUrl}/pages`).subscribe((data:any[])=>{
      for(const i of data){
        this.pages.push(i.pageName)
      }
    })
  }
  flipCard() {
    this.isFlipped = !this.isFlipped;
  }
  /* ---------------------------- style editor form --------------------------- */
  showStyleGroup(group:string){
    if(this.showStyleGroupArray.includes(group)){
      this.showStyleGroupArray = this.showStyleGroupArray.filter((_) => _ !== group)
    }else{
      this.showStyleGroupArray.push(group)
    }
  }
  selectedStyle(style:string){
    if(this.selectedStyles.includes(style)){
      this.selectedStyles = this.selectedStyles.filter((_) => _ !== style)
    }else{
      this.selectedStyles.push(style)
    }
  }
  
  checkStyleSelectedGroup(obj: style): boolean {
    return obj.group.map((item) => {return this.selectedStyles.includes(item.value)}).some((item: any) => item === true)
  }
  /* ---------------------------- style editor form --------------------------- */
  
  
  /* ---------------------------- configurator form --------------------------- */
  @ViewChild('file') fileInput!: ElementRef;
  fileInputTrigger(){
    this.fileInput.nativeElement.click()
  }
  
  returnForms(){
    this.isFlipped = false
    this.selectedStyles = []
  }
  setImage(imagePath: string){
    emitSetImg(imagePath)
  }
  setImageUrl(e:any){
    this.setImage(e.target.value)
  }
  galleryMenuClick(status:boolean){
    this.gallery.toggleAside(status);
  }
  sendImage(e:any){
    let fileList: FileList = e.target.files;
    
    if (fileList.length < 1) {
      return;
    }
    interface ServerResponse {
      filename: string;
    }
    let file: File = fileList[0];
    let formData:FormData = new FormData();
    formData.append('uploadImage', file, file.name)
    this.req.Post<ServerResponse>(`${environment.apiUrl}/images`, formData).subscribe(data =>{
      const filename = data['filename'];
      const path = `${environment.apiUrl}/static/imgs/uploads/${filename}`
      this.setImage(path)
      if(this.gallery.images.length < 4)
      this.gallery.images.push(path)
    })
  }
  setListChildren(e:any){
    emitSetList(e.target.value)
  }
  changeTitle(e:any){
    emitTitleType(e.target.value)
  }
  changeBtnSrc(e:any){
    console.log(e)
    emitBtnSrc(e.target.value)
  }
  /* ---------------------------- configurator form --------------------------- */
}
