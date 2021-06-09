import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroExamPage } from './intro-exam.page';

const routes: Routes = [
  {
    path: '',
    component: IntroExamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroExamPageRoutingModule {}
