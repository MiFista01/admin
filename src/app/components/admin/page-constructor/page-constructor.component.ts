import { CommonModule } from '@angular/common';
import { afterNextRender, Component, ElementRef, ViewChild } from '@angular/core';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorService } from '@services/constructor.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
import { Subscription } from 'rxjs';
declare function emitCreateCondtructorTree(parent: String): any
declare function setHTML(parent: any, html: any): any
interface pageShema {
  body: {
    main: {
      update: boolean,
      children: any,
      html: string
    }
  }
}
interface page {
  id: number
  pageName: string
  pageImg: string
  popular: number
  createdAt: string
  updatedAt: string
}
@Component({
  selector: 'app-page-constructor',
  standalone: true,
  imports: [
    CommonModule,
    EditConfigFormsComponent,
    ConstructorElementComponent
  ],
  templateUrl: './page-constructor.component.html',
  styleUrl: './page-constructor.component.scss'
})
export class PageConstructorComponent {
  private subRoute: Subscription | undefined
  private routerSubscription: Subscription | undefined;
  @ViewChild('update', { static: true }) target!: ElementRef;
  pageObj: any = {}
  pageShema: any = {}
  constructorElements: unknown[] = []
  name = ""
  updateImg = ""
  autoUpdateImg = ""
  updatedStatus = false
  autoUpdatedStatus = false
  timeOut:any
  constructor(
    private sl: ScriptloaderService,
    private constructorService: ConstructorService,
    private route: ActivatedRoute,
    private req: RequestsService,
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
  ngOnInit(): void {
    setInterval(() => {
      this.saveStructure("auto")
    }, 5 * 60 * 1000);

    this.subRoute = this.route.params.subscribe(params => {
      const id = params['id']
      this.req.Get<page>(`${environment.apiUrl}/pages/${id}`).subscribe((data) => {
        this.pageObj = data
        this.name = data.pageName
      })
      this.req.Get<pageShema>(`${environment.apiUrl}/pages/schema/${id}`, true).subscribe((data) => {
        this.pageShema = data
        setHTML("main", this.pageShema.body.main.html)
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
  saveStructure(saveType: "auto"|"handler"){
    const constructor = emitCreateCondtructorTree("main")
    this.pageShema.body.main.children = constructor[0]
    this.pageShema.body.main.html = constructor[1]
    if(!this.updatedStatus || !this.autoUpdatedStatus)
    this.req.Patch(`${environment.apiUrl}/pages/schema/${this.pageObj.id}`, this.pageShema).subscribe(data => {
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
    this.subRoute?.unsubscribe()
  }
}
