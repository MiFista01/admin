import { Routes } from '@angular/router';
import { HomeComponent } from './components/admin/home/home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { HeadComponent } from './components/admin/head/head.component';
import { HeaderFooterComponent } from './components/admin/header-footer/header-footer.component';
import { PagesComponent } from './components/admin/pages/pages.component';
import { FilesComponent } from './components/admin/files/files.component';
import { MessagesComponent } from './components/admin/messages/messages.component';
import { UsersComponent } from './components/admin/users/users.component';
import { TemplatesComponent } from './components/admin/templates/templates.component';
import { PageComponent } from './components/page/page.component';

export const routes: Routes = [
    {"path":"admin", component:AdminComponent, children:[
        {"path":"", component:HomeComponent},
        {"path":"dashboard", component:DashboardComponent},
        {"path":"head", component:HeadComponent},
        {"path":"head-foot", component:HeaderFooterComponent},
        {"path":"pages", component:PagesComponent},
        {"path":"files", component:FilesComponent},
        {"path":"messages", component:MessagesComponent},
        {"path":"user", component:UsersComponent},
        {"path":"templates", component:TemplatesComponent}
    ]},
    {"path":":page", component: PageComponent},
];
