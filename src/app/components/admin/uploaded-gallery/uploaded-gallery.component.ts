import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { GalleryItemComponent } from '../gallery-item/gallery-item.component';
import {environment} from "@config"
import { RequestsService } from '@services/admin/requests.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-uploaded-gallery',
  standalone: true,
  imports: [CommonModule, GalleryItemComponent],
  templateUrl: './uploaded-gallery.component.html',
  styleUrl: './uploaded-gallery.component.scss'
})
export class UploadedGalleryComponent {
  images:string[] = []
  private imagesLengthSubject = new BehaviorSubject<number>(0);
  imagesLength$ = this.imagesLengthSubject.asObservable();
  flipped = true
  uploadImageStatus = false
  party = 0
  @ViewChild('imagesDiv') imagesDiv!: ElementRef;
  @Output() setImageInput = new EventEmitter<string>();
  constructor(private req: RequestsService){}
  ngOnInit(){
    this.req.Get<[]>(`${environment.apiUrl}/images/0`).subscribe(data=>{
      data.forEach(imageSrc=>{
        this.images.push(`${environment.apiUrl}/static/imgs/uploads/${imageSrc}`)
      })
      this.imagesLengthSubject.next(this.images.length)
    })
  }

  public toggleAside(status:boolean){
    this.flipped = status
  }
  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop < element.clientHeight+40 && !this.uploadImageStatus) {
      this.req.Get<number>(`${environment.apiUrl}/images/length`).subscribe(value=>{
        if( value != this.images.length){
          this.uploadImageStatus = true
          if(this.images.length % 4 == 0){
            this.party++
          }else{
            const desiredLength = Math.floor(this.images.length / 4) * 4;
            this.images.splice(desiredLength);
          }
          this.req.Get<[]>(`${environment.apiUrl}/images/${this.party}`).subscribe(data=>{
            data.forEach((value) => {
              this.images.push(`${environment.apiUrl}/static/imgs/uploads/${value}`)
            })
            this.uploadImageStatus = false
          })
        }
      })
    }
  }
  setImage(imagePath: string){
    this.setImageInput.emit(imagePath)
  }
}
