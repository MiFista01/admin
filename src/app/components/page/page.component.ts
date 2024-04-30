import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "@config"
import { filter } from 'rxjs';
import { PageService } from '@services/page.service';
import { ElementComponent } from '../element/element.component';
import { CommonModule, DOCUMENT } from '@angular/common';
interface schema {
  head: {
    css: string[]
    js: string[]
    tags: string[]
    title: string
    des: string
  }
  body: {
    header: any
    main: any
    footer: any
  }
}
@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, ElementComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  pageName = ""
  schema: any = {}
  children: any[] = []
  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }
  ngOnInit() {
    this.pageName = this.route.snapshot.params['page']
    this.schema = this.pageService.getPageSchema<schema>(this.pageName)?.subscribe((data) => {
      this.children = data?.body?.main?.children
      if (data.head?.css)
        for (const cssName of data.head?.css) {
          const link = this.renderer.createElement('link');
          link.rel = 'stylesheet';
          link.href = `${environment.apiUrl}/static/css/${cssName}`;
          this.renderer.appendChild(this.document.head, link);
        }
      if (data.head?.js)
        for (const scriptName of data.head?.js) {
          const script = this.renderer.createElement('script');
          script.src = `${environment.apiUrl}/static/js/${scriptName}`;
          script.async = true;
          this.renderer.appendChild(this.document.head, script);
        }
    });
  }
  ngOnDestroy() {
    this.schema.unsubscribe();
  }
}
