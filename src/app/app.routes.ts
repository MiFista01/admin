import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { HeadComponent } from './components/admin/head/head.component';
import { HeaderFooterComponent } from './components/admin/header-footer/header-footer.component';
import { FilesComponent } from './components/admin/files/files.component';
import { UsersComponent } from './components/admin/users/users.component';
import { TemplatesComponent } from './components/admin/templates/templates.component';
import { PageComponent } from './components/page/page.component';
import { PagesComponent } from './components/admin/pages/pages.component';
import { PageSettingsComponent } from './components/admin/page-settings/page-settings.component';
import { PageConstructorComponent } from './components/admin/page-constructor/page-constructor.component';
import { TemplatePageComponent } from './components/admin/template-page/template-page.component';
import { DatabaseComponent } from './components/admin/database/database.component';
import { FAQComponent } from './components/admin/faq/faq.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '@guards/auth.guard';



export const routes: Routes = [
    {
        "path": "admin", component: AdminComponent, children: [
            { "path": "", component: HomeComponent },
            { "path": "login", component: LoginComponent },
            { "path": "dashboard", component: DashboardComponent, canActivate: [authGuard]},
            { "path": "head", component: HeadComponent, canActivate: [authGuard]},
            { "path": "head-foot", component: HeaderFooterComponent, canActivate: [authGuard]},
            { "path": "files", component: FilesComponent, canActivate: [authGuard]},
            { "path": "pages", component: PagesComponent, canActivate: [authGuard]},
            { "path": "pages", component: PagesComponent, canActivate: [authGuard]},
            { "path": "pages/:id", component: PageSettingsComponent, canActivate: [authGuard]},
            { "path": "pages/:id/constructor", component: PageConstructorComponent, canActivate: [authGuard]},
            { "path": "templates", component: TemplatesComponent, canActivate: [authGuard]},
            { "path": "templates/:id", component: TemplatePageComponent, canActivate: [authGuard]},
            { "path": "db", component: DatabaseComponent, canActivate: [authGuard]},
            { "path": "user", component: UsersComponent, canActivate: [authGuard]},
            { "path": "faq", component: FAQComponent, canActivate: [authGuard]},
        ]
    },
    { "path": "", redirectTo: "home", pathMatch: 'full' },
    { "path": ":page", component: PageComponent },
];
