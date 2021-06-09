import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss'],
})
export class StarterPage implements OnInit {

  credentials: FormGroup;
  api_url = environment.api_url;

  constructor(private auth: AuthService,
              private fb: FormBuilder,
              private http: HttpClient,
              private otherSrvc: OtherService,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      access_code: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  startExam(){
    this.checkExam().subscribe();
  }

  checkExam(){
    
    return this.http.post(`${this.api_url}/api/start_exam`, this.credentials.value)
      .pipe(
        tap(res => {
          if (res['error']) {
            this.otherSrvc.showAlert('Kesalahan', res['message']);
          } else {
            // console.log(res['ujian']);
            this.toIntroExam(res['ujian'], res['detail_ujian']);
          }

        }),
        catchError(e => {
          this.otherSrvc.showAlert('Kesalahan', e.error.message);
          throw new Error(e);
        })
      );
  }

  toIntroExam(data_exam, detail_exam){
    let navigationExtras: NavigationExtras ={
      queryParams:{
        id: data_exam.id,
        id_detail: data_exam.id_detail,
        tanggal_mulai: data_exam.tanggal_mulai,
        tanggal_akhir: data_exam.tanggal_akhir,
        jam_mulai: data_exam.jam_mulai,
        durasi: data_exam.durasi,
        keterangan: data_exam.keterangan,
        mapel: detail_exam.get_mapel.mapel,
        tingkat: detail_exam.get_tingkat.tingkat
      }
    }
    this.navCtrl.navigateForward(['/intro-exam'], navigationExtras);
  }
  

  logout (){
    this.auth.logout();
  }

}
