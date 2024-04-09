import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {environment} from "@config"
import { RequestsService } from '@services/admin/requests.service';

@Component({
  selector: 'app-page-settings',
  standalone: true,
  imports: [],
  templateUrl: './page-settings.component.html',
  styleUrl: './page-settings.component.scss'
})
export class PageSettingsComponent {
  page:any = {}
  constructor(
    private route: ActivatedRoute,
    private req: RequestsService
  ){}
  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const pageName = params.get('pageName');
      this.req.Get<any[]>(`${environment.apiUrl}/pages`).subscribe((data)=>{
        this.page = data.filter(value=> value.pageName == pageName)[0]
      })
    });
  }
}
