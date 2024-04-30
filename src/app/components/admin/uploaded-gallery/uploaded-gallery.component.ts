import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import {environment} from "@config"
import { RequestsService } from '@services/admin/requests.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-uploaded-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploaded-gallery.component.html',
  styleUrl: './uploaded-gallery.component.scss'
})
export class UploadedGalleryComponent {
  images:string[] = []
  private imagesLengthSubject = new BehaviorSubject<number>(0);
  imagesLength$ = this.imagesLengthSubject.asObservable();
  showGallery = false
  uploadImageStatus = false
  @ViewChild('imagesDiv') imagesDiv!: ElementRef;
  @Output() setImageInput = new EventEmitter<string>();
  constructor(private req: RequestsService){}
  ngOnInit(){
    this.req.Get<[any[], any[]]>(`${environment.apiUrl}/files/imgs-uploads`).subscribe(data=>{
      this.images = data[1].map(value=>{
        return `${environment.apiUrl}/static/imgs/uploads/${value.fileName}`
      })
      this.imagesLengthSubject.next(data[1].length)
    })
  }
  public toggleAside(status:boolean){
    if(status){
      this.req.Get<[any[], any[]]>(`${environment.apiUrl}/files/imgs-uploads`).subscribe(data=>{
        this.images = data[1].map(value=>{
          return `${environment.apiUrl}/static/imgs/uploads/${value.fileName}`
        })
        this.imagesLengthSubject.next(data[1].length)
        this.showGallery = status
      })
      
    }else{
      this.showGallery = status
    }
  }
  setImage(imagePath: string){
    this.setImageInput.emit(imagePath)
  }
  
}
