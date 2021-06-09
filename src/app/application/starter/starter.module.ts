import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StarterPageRoutingModule } from './starter-routing.module';

import { StarterPage } from './starter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarterPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [StarterPage]
})
export class StarterPageModule {}
