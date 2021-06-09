import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OtherService {

  constructor(private alert: AlertController) { }

  showAlert(header, msg){
    let alertDialog = this.alert.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });
    alertDialog.then(alertDialog => alertDialog.present());
  }
}
