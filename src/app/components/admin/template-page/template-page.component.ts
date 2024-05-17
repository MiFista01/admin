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
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare function emitCreateCondtructorTree(parent: string): any
declare function setHTML(parent: any, html: any): any
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
  templateSchema: schema = {
    body: {
      main: {
        update: true,
        children: [],
        html: ""
      }
    }
  }
  constructorElements: unknown[] = []
  templateId = 0
  updatedStatus = false
  autoUpdatedStatus = false
  templateName = ""
  updateImg = ""
  autoUpdateImg = ""
  timeOut:any
  private routerSubscription: Subscription | undefined;
  constructor(
    private sl: ScriptloaderService,
    private fb: FormBuilder,
    private constructorService: ConstructorService,
    private req: RequestsService,
    private route: ActivatedRoute,
    private router: Router
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
  ngOnInit() {
    setInterval(() => {
      this.saveStructure("auto")
    }, 5 * 60 * 1000);

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

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.saveStructure("auto")
      }
    });
  }
  updateStructure() {
    this.saveStructure("handler")
  }
  hideWindow() {
    this.updatedStatus = false
    setTimeout(() => {
      this.updateImg = ""
    }, 500);
  }
  saveStructure(saveType: "auto"|"handler") {
    const headeConstructor = emitCreateCondtructorTree(".template-body")
    this.templateSchema.body.main.children = headeConstructor[0]
    this.templateSchema.body.main.html = headeConstructor[1]
    this.req.Patch(`${environment.apiUrl}/templates/schema/${this.templateId}`, this.templateSchema).subscribe(data => {
      if (data) {
        if(saveType == "auto"){
          this.autoUpdatedStatus = true
          this.autoUpdateImg = "./assets/imgs/constructor/success.gif"
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            if (this.autoUpdatedStatus){
              this.autoUpdatedStatus = false
              setTimeout(() => {
                if(this.autoUpdateImg)
                  this.autoUpdateImg = ""
              }, 500);
            }
          }, 3000);
        }else{
          this.updateImg = ""
          this.updatedStatus = true
          this.updateImg = "./assets/imgs/constructor/success.gif"
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            if (this.updatedStatus){
              this.updatedStatus = false
              setTimeout(() => {
                if(this.updateImg)
                  this.updateImg = ""
              }, 500);
            }
          }, 3000);
        }
      }
    })
  }
  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
