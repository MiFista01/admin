import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { CommonModule } from '@angular/common';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ConstructorService } from '@services/constructor.service';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
declare function emitCreateCondtructorTree(parent: string): any
declare function setHTML(parent:any, html:any): any
interface schema {
  body: {
    main: {
      update: boolean
      children: any
      html: string
    }
  }
}
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
  @ViewChild('update', { static: true }) target!: ElementRef;
  constructorElements: unknown[] = []
  headerSchema: schema = {
    body: {
      main: {
        update: true,
        children: [],
        html: ""
      }
    }
  }
  footerSchema: schema = {
    body: {
      main: {
        update: true,
        children: [],
        html: ""
      }
    }
  }
  constructor(
    private sl: ScriptloaderService,
    private fb: FormBuilder,
    private req: RequestsService,
    private constructorService: ConstructorService,

  ) {
    for (const key of Object.keys(constructorService.elements)) {
      const element = {
        type: key,
        ...constructorService.elements[key]
      }
      this.constructorElements.push(element)
    }
    afterNextRender(() => {
      this.sl.createConstructor()

    });
  }
  ngOnInit(){
    setInterval(() => {
      this.target.nativeElement.click()
    }, 300000);
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/header`, true).subscribe((data) => {
      this.headerSchema = data
      setHTML(".constructorMain header", this.headerSchema.body.main.html)
    })
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/footer`).subscribe((data) => {
      this.footerSchema = data
      setHTML(".constructorMain footer", this.footerSchema.body.main.html)
    })
  }
  updateStructure() {
    const headeConstructor = emitCreateCondtructorTree("header")
    this.headerSchema.body.main.children = headeConstructor[0]
    this.headerSchema.body.main.html = headeConstructor[1]
    this.req.Patch(`${environment.apiUrl}/pages/schema/header`, this.headerSchema).subscribe(data=>{
      console.log(data)
    })
    const footerConstructor = emitCreateCondtructorTree("footer")
    this.footerSchema.body.main.children = footerConstructor[0]
    this.footerSchema.body.main.html = footerConstructor[1]
    this.req.Patch(`${environment.apiUrl}/pages/schema/footer`, this.footerSchema).subscribe(data=>{
      console.log(data)
    })
  }
  
}
