import { CommonModule } from '@angular/common';
import { afterNextRender, Component } from '@angular/core';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorService } from '@services/constructor.service';
declare function emitCreateCondtructorTree():any
@Component({
  selector: 'app-template-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UploadedGalleryComponent,
    ConstructorElementComponent,
    EditConfigFormsComponent],
  templateUrl: './template-page.component.html',
  styleUrl: './template-page.component.scss'
})
export class TemplatePageComponent {
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
