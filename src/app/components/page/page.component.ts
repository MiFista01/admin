import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "@config"
import { filter } from 'rxjs';
import { PageService } from '@services/page.service';
import { ElementComponent } from '../element/element.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RequestsService } from '@services/admin/requests.service';
import { Meta, Title } from '@angular/platform-browser';
interface schema {
  head: {
    css: string[]
    js: string[]
    tags: string[]
    title: string
    description: string
  }
  body: {
    main: {
      update: boolean
      children: any
    }
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
  headerSchema: any = {}
  mainSchema: any = {}
  mainPageSchema: any = {}
  footerSchema: any = {}
  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private req: RequestsService,
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private metaService: Meta
  ) { }
  ngOnInit() {
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/main`).subscribe((data) => {
      if (data) {
        this.mainSchema = data
        if (data.head.title) {
          this.titleService.setTitle(data.head.title);
        }
        if (data.head.description) {
          this.metaService.updateTag({ name: 'description', content: data.head.description });
        }
        if (data.head.tags) {
          this.metaService.updateTag({ name: 'keywords', content: data.head.tags.join() });
        }
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
      }
    });
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/header`).subscribe(data => {
      if (data)
        this.headerSchema = data
    })
    this.req.Get<schema>(`${environment.apiUrl}/pages/schema/footer`).subscribe(data => {
      if (data)
        this.footerSchema = data
    })
    this.route.params.subscribe(params => {
      this.pageName = this.route.snapshot.params['page']
      this.req.Get<schema>(`${environment.apiUrl}/pages/guest-schema/${this.pageName}`).subscribe((data) => {
        this.mainPageSchema = data
        if (data) {
          if (data.head.title) {
            this.titleService.setTitle(this.titleService.getTitle().split("-")[0] + "-" + data.head.title);
          }
          if (data.head.description) {
            this.metaService.updateTag({ name: 'description', content: data.head.description });
          }
          if (data.head.tags) {
            this.metaService.updateTag({ name: 'keywords', content: data.head.tags.join() });
          }
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
        }
      });
    });
  }
}
