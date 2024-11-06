import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { ValetinfopageComponent } from './pages/valetinfopage/valetinfopage.component';
import { ValetLandingPageComponent } from './pages/valet-landing-page/valet-landing-page.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { AuthGuard } from './Services/auth.guard.service';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PageNotFound404Component } from './pages/page-not-found-404/page-not-found-404.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    
    { path: 'user/home/:id', component: UserHomePageComponent, canActivate: [AuthGuard], data: { role: 'User' } },
    { path: 'valet/home/:id', component: ValetLandingPageComponent, canActivate: [AuthGuard], data: { role: 'Valet' } },
    { path: 'valet/info', component: ValetinfopageComponent, canActivate: [AuthGuard], data: { role: 'User' } },
    { path: 'valet/notifications', component: NotificationsComponent, canActivate: [AuthGuard], data: { role: 'Valet' } },
    {path : 'admin/home/:id', component: AdminPanelComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
    
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: PageNotFound404Component }  
];
