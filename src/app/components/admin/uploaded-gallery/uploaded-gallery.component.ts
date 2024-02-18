import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GalleryItemComponent } from '../gallery-item/gallery-item.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-uploaded-gallery',
  standalone: true,
  imports: [CommonModule,HttpClientModule, GalleryItemComponent],
  templateUrl: './uploaded-gallery.component.html',
  styleUrl: './uploaded-gallery.component.scss'
})
export class UploadedGalleryComponent {
  constructor(private http: HttpClient){}
  items: string[] = [];
  isLoading = false
  end = false
  party = 1
  sendLendth = 4

  startLoop(party:number, increment:boolean) {
    if(increment){
      if(this.items.length % this.sendLendth == 0 && party != 0){
        this.party++;
      }
    }
    if(party == 0){
      this.items = []
      this.party = 1
      this.end = false
      this.isLoading = false
    }
    // Здесь вы можете определить логику вашего цикла
    let receivedPictures = this.http.get<string[]>(`http://localhost:3000/images/${party}`).subscribe(data =>{
      if(data.length == 0){
        this.end = true
        return;
      }
      for (let i of data) {
        this.items.push(`http://localhost:3000/static/imgs/${i}`)
      }
      this.isLoading = false
    })
  }
  addImage(src:string){
    this.items.push(src)
  }
  right = '-20vw';
  @Output() newItemEvent = new EventEmitter<string>();
  toggleAside(open?:boolean, selectedImage?: string) {
    if(open == undefined){
      this.right = this.right === '-20vw' ? '0vw' : '-20vw';
      if(selectedImage){
        this.newItemEvent.emit(selectedImage);
      }
    }else{
      this.right = open === true ? '0vw' : '-20vw';
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight && !this.isLoading && !this.end) {
      this.startLoop(this.party, true)
      this.isLoading = true
    }
  }
}
