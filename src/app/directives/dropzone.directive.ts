import { ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Injector, Output, TemplateRef, ViewContainerRef, ViewRef, ComponentFactoryResolver, ApplicationRef, Attribute } from '@angular/core';
import { ConstructorService } from '@services/constructor.service';
import { ConstructorElementComponent } from 'app/components/admin/constructor-element/constructor-element.component';


@Directive({
  selector: '[ngDropzone]',
  standalone: true
})
export class DropzoneDirective {
  constructor(
    private constructorService: ConstructorService,
    private injector:Injector,
    private componentFactoryResolver:ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) {}
  @Output() onClickDrop = new EventEmitter();
  hoveredElement:null|EventTarget  = null

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(e:Event) {
    this.hoveredElement = e.currentTarget
  }
  @HostListener('mouseleave', ['$event'])
  onMouseLeav(e:Event) {
    this.hoveredElement = null
  }

  @HostListener('click', ['$event'])
  onDrop(e:Event) {
    const cloneContainer = document.getElementById("clone-container") as HTMLElement;
    if(this.hoveredElement && cloneContainer?.firstElementChild != null){
        const parent = e.currentTarget as HTMLElement;
        const placeholder = parent.querySelector('p.placeholder') as HTMLElement;
        placeholder.style.display = "none"
        const hostElement = e.currentTarget as Node;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConstructorElementComponent);
        const componentRef = componentFactory.create(this.injector, [], hostElement);
        const elementType = cloneContainer?.firstElementChild?.getAttribute("element-type") as string;
        const elements = this.constructorService.elements
        const elementConfigs = elements[elementType as keyof typeof elements]
        componentRef.instance.element = {
          type: elementType,
          ...elementConfigs
        }

        this.appRef.attachView(componentRef.hostView);
        if (cloneContainer) {
          while (cloneContainer.firstChild) {
            cloneContainer.removeChild(cloneContainer.firstChild);
          }
        }
        this.constructorService.changeRightAsideStatus(true)
    }
  }
}
