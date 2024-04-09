import {Component, afterNextRender } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { CommonModule } from '@angular/common';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ConstructorService } from '@services/constructor.service';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
declare function emitCreateCondtructorTree():any
@Component({
  selector: 'app-header-footer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UploadedGalleryComponent,
    ConstructorElementComponent,
    EditConfigFormsComponent
  ],
  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss',
})
export class HeaderFooterComponent {
  constructorElements:unknown[] = []
  constructor(
    private sl:ScriptloaderService,
    private fb: FormBuilder,
    private constructorService:ConstructorService,
    
  ){
    for( const key of Object.keys(constructorService.elements)){
      const element = {
        type:key,
        ...constructorService.elements[key]
      }
      this.constructorElements.push(element)
    }
    afterNextRender (() => {
      this.sl.createConstructor()
      
    });
  }
  updateImage(){
    emitCreateCondtructorTree()
  }
}
