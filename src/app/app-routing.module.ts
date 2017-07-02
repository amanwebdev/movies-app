import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AnalyticsComponent } from './analytics.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
