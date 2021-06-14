import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HasilUjianPageRoutingModule } from './hasil-ujian-routing.module';

import { HasilUjianPage } from './hasil-ujian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HasilUjianPageRoutingModule
  ],
  declarations: [HasilUjianPage]
})
export class HasilUjianPageModule {}
