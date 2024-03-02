import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PageService } from '../../services/page.service';
import { ElementComponent } from '../element/element.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, ElementComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  pageName = ""
  schema:any = {}
  children:any[] = [] 
  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService){}
  async ngOnInit(){
    this.pageName = this.route.snapshot.params['page']
    this.schema = await this.pageService.getPageSchema(this.pageName);
    this.children = this.schema.body.main.children
  }
}
