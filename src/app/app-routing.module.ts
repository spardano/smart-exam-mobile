import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'starter',
    loadChildren: () => import('./application/starter/starter.module').then( m => m.StarterPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'intro-exam',
    loadChildren: () => import('./application/intro-exam/intro-exam.module').then( m => m.IntroExamPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'exam',
    loadChildren: () => import('./application/exam/exam.module').then( m => m.ExamPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'hasil-ujian',
    loadChildren: () => import('./application/hasil-ujian/hasil-ujian.module').then( m => m.HasilUjianPageModule),
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
