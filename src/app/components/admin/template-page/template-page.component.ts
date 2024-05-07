import { CommonModule } from '@angular/common';
import { afterNextRender, Component, ElementRef, ViewChild } from '@angular/core';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorService } from '@services/constructor.service';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild('update', { static: true }) target!: ElementRef;
  constructorElements:unknown[] = []
  templateName = ""
  templateId = 0
  templateSchema: schema = {
    body: {
      main: {
        update: true,
        children: [],
        html: ""
      }
    }
  }
  constructor(
    private sl:ScriptloaderService,
    private fb: FormBuilder,
    private constructorService:ConstructorService,
    private req:RequestsService,
    private route: ActivatedRoute,
    
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
  ngOnInit(){
    setInterval(() => {
      this.target.nativeElement.click()
    }, 300000);
    this.route.params.subscribe(params => {
      this.templateId = params['id']
      this.req.Get<any>(`${environment.apiUrl}/templates/${params['id']}`).subscribe((data) => {
        this.templateName = data.name
      })
      this.req.Get<schema>(`${environment.apiUrl}/templates/schema/${this.templateId}`, true).subscribe((data) => {
        this.templateSchema = data
        setHTML(".constructorMain .template-body", this.templateSchema.body.main.html)
      })
    });
  }
  updateStructure() {
    const headeConstructor = emitCreateCondtructorTree(".template-body")
    this.templateSchema.body.main.children = headeConstructor[0]
    this.templateSchema.body.main.html = headeConstructor[1]
    this.req.Patch(`${environment.apiUrl}/templates/schema/${this.templateId}`, this.templateSchema).subscribe(data=>{
      console.log(data)
    })

  }
}
