import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HasilUjianPage } from './hasil-ujian.page';

const routes: Routes = [
  {
    path: '',
    component: HasilUjianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HasilUjianPageRoutingModule {}
