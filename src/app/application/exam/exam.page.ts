import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.page.html',
  styleUrls: ['./exam.page.scss'],
})
export class ExamPage implements OnInit {

  answer:any = [];
  soal:any = [];
  api_url = environment.api_url;
  soalLength:number;
  nomorSoal= 1;

  constructor(private http: HttpClient,
              private other: OtherService,
              private route: ActivatedRoute,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getSoal().subscribe();
  }

  checkAnswer(answer, index){
    if(this.answer [index]){
      this.answer.splice(index, 1)
      console.log(this.answer);
    }else{
      this.answer[index] = answer;
      console.log(this.answer);
    }
  }

  anwered(index, alfa){
    if(this.answer.length > 0){
      if(this.answer[index] == alfa){
        return true;
      }else{
        return false;
      }
    }
    return false;
  }

  getSoal(){
    const idJadwal = this.route.snapshot.params.id;
    return this.http.get(`${this.api_url}/api/start_exam/get_soal/${idJadwal}`)
    .pipe(
      tap(res => {
        if (res['error']) {
          this.other.showAlert('Kesalahan', res['message']);
        }else{
          this.soal = res['soal'];
          this.soalLength = this.soal.length;
          console.log(res['soal']);
        }
      }), 
    catchError(e => {
      this.other.showAlert('Kesalahan', e.error.message);
      throw new Error(e);
    })
    );
  }

  selesaiUjian(){

    let messageAlert = '';

    if(this.answer.length != this.soalLength){
      const defisitJawaban = this.soalLength - this.answer.length;
      messageAlert += 'Terdapat '+ defisitJawaban + ' soal belum dijawab, '
    }

    messageAlert += 'Anda yakin ingin menyelesaikan ujian ?';

    let alert = this.alertCtrl.create({
      header:'Perhatian',
      message: messageAlert,
      buttons: [{
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('cancel')
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.hitungHasil();
          }
        }
      ]
    });

    alert.then(alert => alert.present());
  }

  hitungHasil(){

    let jawabanBenar = 0;
    let jawabanSalah = 0;

    this.soal.forEach(item => {
      if(item.jawaban != this.answer[item.nomor-1].toLowerCase()){
        console.log(item.jawaban)
        jawabanSalah++;
      }else{
        console.log(item.jawaban)
        jawabanBenar++;
      }
    });

    console.log("Benar: "+jawabanBenar);
    console.log("Salah: "+jawabanSalah);

    const scorePerPoin = 100/this.soalLength;

    const nilai = Math.ceil(jawabanBenar*scorePerPoin);

    console.log("score: "+ nilai)

    console.log('ujian selesai')
  }

  // increaseNomorSoal(){
  //   this.nomorSoal = this.nomorSoal + 1;
  //   console.log(this.nomorSoal);
  // }
  // decreaseNomorSoal(){
  //   this.nomorSoal = this.nomorSoal - 1;
  //   console.log(this.nomorSoal);
  // }
  // updateNomorSoal(nomor){
  //   this.nomorSoal = nomor;
  // }

  isAnswered(indexJawabanSoal){
    if(this.answer[indexJawabanSoal]){
      return true;
    }
    
    return false;
  }
 
}
