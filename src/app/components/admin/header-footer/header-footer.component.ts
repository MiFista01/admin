import { Component, ElementRef, EventEmitter, Output, ViewChild, afterNextRender, afterRender } from '@angular/core';
import { ScriptloaderService } from '../../../services/scriptloader.service';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomainService } from '../../../services/domain.service';
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
  constructor(private sl:ScriptloaderService, private fb: FormBuilder, private http: HttpClient, private domain:DomainService){
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
    this.http.post<ServerResponse>(`http://localhost:3000/image`, formData).subscribe(data =>{
      const filename = data['filename'];
      const path = `http://localhost:3000/static/imgs/${filename}`
      this.selectImg(path)
      this.childComponent?.addImage(path)
    })
    
  }
  setExImg(event:any){
    let imgURL: string = event.target.value;
    this.selectImg(imgURL)
  }
  
}
