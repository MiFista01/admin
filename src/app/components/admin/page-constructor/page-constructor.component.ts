import { CommonModule } from '@angular/common';
import { afterNextRender, Component } from '@angular/core';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorService } from '@services/constructor.service';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from '@config';
declare function emitCreateCondtructorTree(): any
declare function setHTML(parent:any, html:any): any
declare function initBody():any
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
    this.route.params.subscribe(params => {
      this.name = params['pageName']
      this.req.Get<page[]>(`${environment.apiUrl}/pages`).subscribe((data) => {
        this.pageObj = data.filter(value => value.pageName == this.name)[0]
      })
      this.req.Get<pageShema>(`${environment.apiUrl}/pages/schema/${this.name}`).subscribe((data) => {
        this.pageShema = data
        setHTML("main", this.pageShema.body.main.html)
      })
    });
  }
  updateImage() {
    const constructor = emitCreateCondtructorTree()
    this.pageShema.body.main.children = constructor[0]
    this.pageShema.body.main.html = constructor[1]
    this.req.Patch(`${environment.apiUrl}/pages/schema/${this.pageObj.id}`, this.pageShema).subscribe(data=>{
      console.log(data)
    })
  }
}
