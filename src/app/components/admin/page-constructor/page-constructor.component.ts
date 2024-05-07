import { CommonModule } from '@angular/common';
import { afterNextRender, Component, ElementRef, ViewChild } from '@angular/core';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorService } from '@services/constructor.service';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
declare function emitCreateCondtructorTree(parent:String): any
declare function setHTML(parent:any, html:any): any
interface pageShema {
  body: {
    main: {
      update: boolean,
      children: any,
      html:string
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
  @ViewChild('update', { static: true }) target!: ElementRef;
  name = ""
  pageObj: any = {}
  pageShema:any = {}
  constructorElements: unknown[] = []
  constructor(
    private sl: ScriptloaderService,
    private constructorService: ConstructorService,
    private route: ActivatedRoute,
    private req: RequestsService
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
      this.target.nativeElement.click()
    }, 300000);
    this.route.params.subscribe(params => {
      const id = params['id']
      this.req.Get<page>(`${environment.apiUrl}/pages/${id}`).subscribe((data) => {
        this.pageObj = data
      })
      this.req.Get<pageShema>(`${environment.apiUrl}/pages/schema/${id}`, true).subscribe((data) => {
        this.pageShema = data
        setHTML("main", this.pageShema.body.main.html)
      })
    });
  }
  updateStructure() {
    const constructor = emitCreateCondtructorTree("main")
    this.pageShema.body.main.children = constructor[0]
    this.pageShema.body.main.html = constructor[1]
    this.req.Patch(`${environment.apiUrl}/pages/schema/${this.pageObj.id}`, this.pageShema).subscribe(data=>{
      console.log(data)
    })
  }
}
