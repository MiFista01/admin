import { Component, ElementRef,ViewChild, afterNextRender } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { ScriptloaderService } from '../../../services/scriptloader.service';
import {environment} from "../../../../config"

declare function emitTriggers(): void;
@Component({
  selector: 'app-header-footer',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, UploadedGalleryComponent],
  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss'
})
export class HeaderFooterComponent {
  configs:any
  constructor(private sl:ScriptloaderService, private fb: FormBuilder, private http: HttpClient){
    afterNextRender (() => {
      this.sl.createConstructor()
    });
    this.configs = this.fb.group({
      srctToChange: ['', [Validators.required]],
    });
  }
  @ViewChild(UploadedGalleryComponent, { static: false }) childComponent: UploadedGalleryComponent | undefined;
  showGallery(){
    this.childComponent?.toggleAside()
  }
  hideGallery(){
    this.childComponent?.toggleAside(false)
  }
  
  selectImg(selectedImage:string){
    this.configs.get('srctToChange').setValue(selectedImage);
    emitTriggers()
  }
  saveImage(event:any){
    let fileList: FileList = event.target.files;
    
    if (fileList.length < 1) {
      return;
    }
    interface ServerResponse {
      filename: string;
    }
    let file: File = fileList[0];
    let formData:FormData = new FormData();
    formData.append('uploadImage', file, file.name)
    this.http.post<ServerResponse>(`${environment.apiUrl}/images`, formData).subscribe(data =>{
      const filename = data['filename'];
      const path = `${environment.apiUrl}/static/imgs/uploads/${filename}`
      this.selectImg(path)
      if(this.childComponent?.end == true){
        this.childComponent.addImage(path)
      }
      
    })
  }
  setExImg(event:any){
    let imgURL: string = event.target.value;
    this.selectImg(imgURL)
  }
  
  @ViewChild("inputUpload", { static: false }) inputUpload: ElementRef | undefined;
  triggerInput(){
    this.inputUpload?.nativeElement.click();
  }
}
