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
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
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
  updatedStatus = false
  autoUpdatedStatus = false
  updateImg = ""
  autoUpdateImg = ""
  timeOut:any
  private routerSubscription: Subscription | undefined;
  constructor(
    private sl: ScriptloaderService,
    private fb: FormBuilder,
    private req: RequestsService,
    private constructorService: ConstructorService,
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
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/header`, true).subscribe((data) => {
      this.headerSchema = data
      setHTML(".constructorMain header", this.headerSchema.body.main.html)
    })
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/footer`).subscribe((data) => {
      this.footerSchema = data
      setHTML(".constructorMain footer", this.footerSchema.body.main.html)
    })
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
  saveStructure(saveType: "auto"|"handler"){
    const headerConstructor = emitCreateCondtructorTree("header")
    this.headerSchema.body.main.children = headerConstructor[0]
    this.headerSchema.body.main.html = headerConstructor[1]
    this.req.Patch(`${environment.apiUrl}/pages/schema/header`, this.headerSchema).subscribe(data => {
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
    const footerConstructor = emitCreateCondtructorTree("footer")
    this.footerSchema.body.main.children = footerConstructor[0]
    this.footerSchema.body.main.html = footerConstructor[1]
    this.req.Patch(`${environment.apiUrl}/pages/schema/footer`, this.footerSchema).subscribe(data => {})
  }
  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
