import { AfterRenderPhase, Component, ElementRef,ViewChild, afterNextRender, afterRender } from '@angular/core';
import {HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import {environment} from "@config"
import { CommonModule } from '@angular/common';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ConstructorService } from '@services/constructor.service';



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
  ],
  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss',
})
export class HeaderFooterComponent {
  constructorElements:unknown[] = []
  constructor(
    private sl:ScriptloaderService,
    private fb: FormBuilder,
    private constructorService:ConstructorService
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
}
