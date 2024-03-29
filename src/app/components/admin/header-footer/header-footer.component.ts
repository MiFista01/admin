import { Component, ElementRef,ViewChild, afterNextRender } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { ScriptloaderService } from '../../../services/scriptloader.service';
import {environment} from "@config"
import { CommonModule } from '@angular/common';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ConstructorService } from '@services/constructor.service';
import { Subscription } from 'rxjs';
import { MoveDraggabaleElementDirective } from '@directives/move-draggabale-element.directive';
import { DropzoneDirective } from '@directives/dropzone.directive';


declare function emitTriggers(): void;
@Component({
  selector: 'app-header-footer',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    UploadedGalleryComponent,
    ConstructorElementComponent,
    MoveDraggabaleElementDirective,
    DropzoneDirective,
  ],
  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss',
})
export class HeaderFooterComponent {
  configs:FormGroup
  constructor(
    private sl:ScriptloaderService,
    private fb: FormBuilder,
    private http: HttpClient,
    private constructorService: ConstructorService
  ){
    // afterNextRender (() => {
    //   this.sl.createConstructor()
    // });
    this.configs = this.fb.group({
      srctToChange: ['', [Validators.required]],
    });
  }
  rightAside = true
  clone:any = []
  elements = [
    {
      type:"section",
      configurator: false,
      properties:{
        className:"element section prime"
      }
    }
  ]
  
  ngOnInit(): void {
    this.constructorService.selectedElement$.subscribe(status => {
      this.rightAside = status;
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
    this.configs.get('srctToChange')?.setValue(selectedImage);
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

  toggleElementsMenu(){
    this.rightAside = !this.rightAside
  }
  triggerInput(){
    this.inputUpload?.nativeElement.click();
  }

  clickableElements(){
    this.rightAside = true
  }

  newContextMenu(){
    if(!this.rightAside){
      this.rightAside = true
      const container = document.getElementById("clone-container") as HTMLElement;
      if (container?.firstElementChild != null && container.children.length > 0) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      return false
    }
    return true
  }
}
