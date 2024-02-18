import { CommonModule } from '@angular/common';
import { Component, Type, ViewChild, ViewContainerRef, afterRender, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagsComponent } from '../tags/tags.component';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss'
})
export class HeadComponent {
  Bootstrap: any;
  seo: any;
  tagName: string = "";
  tagsNames: string[] = ["car", "recycle", "tank"];
  @ViewChild("tagsContainer", { read: ViewContainerRef })
  container!: ViewContainerRef

  constructor(private fb: FormBuilder) {
    this.Bootstrap = this.fb.group({
      bootstrap: ['', [Validators.required]]
    });
    this.seo = this.fb.group({
      title: ['', [Validators.required]],
      des: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      for (let i of this.tagsNames) {
        this.createComponent(i, TagsComponent)
      }
    });
  }
  onSubmitUpdateBootstrap() {

  }
  onSubmitUpdateSEO() {
    const formData = this.seo.value;
    console.log(formData);
    console.log(this.tagsNames)
  }
  addTag() {
    if (this.tagName != "" && !this.tagsNames.includes(this.tagName)) {
      this.createComponent(this.tagName, TagsComponent)
      this.tagName = ""
    }
  }
  createComponent(value: string, component: Type<any>): void {
    const tag = this.container.createComponent(component)
    tag.setInput("value", value)
    if (this.tagName != "" && !this.tagsNames.includes(value)) {
      this.tagsNames.push(value)
    }
    tag.instance.delete.subscribe((res: any) => {
      tag.destroy()
      // delete this.tagsNames[this.tagsNames.indexOf(tag.instance.value)];
      this.tagsNames.splice(this.tagsNames.indexOf(tag.instance.value), 1)
    });
  }
  onEnter() {
    this.addTag()
  }
}
