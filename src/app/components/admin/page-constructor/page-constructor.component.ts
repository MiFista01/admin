import { CommonModule } from '@angular/common';
import { afterNextRender, Component } from '@angular/core';
import { EditConfigFormsComponent } from '../edit-config-forms/edit-config-forms.component';
import { ConstructorElementComponent } from '../constructor-element/constructor-element.component';
import { ScriptloaderService } from '@services/scriptloader.service';
import { ConstructorService } from '@services/constructor.service';
import { ActivatedRoute } from '@angular/router';
declare function emitCreateCondtructorTree():any
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
  constructorElements:unknown[] = []
  constructor(
    private sl:ScriptloaderService,
    private constructorService:ConstructorService,
    private route: ActivatedRoute
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
  ngOnInit(): void {
    this.route.params.subscribe(params => {
     this.name =  params['pageName']
    });
  }
  updateImage(){
    emitCreateCondtructorTree()
  }
}
