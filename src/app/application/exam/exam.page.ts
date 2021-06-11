import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.page.html',
  styleUrls: ['./exam.page.scss'],
})
export class ExamPage implements OnInit, OnDestroy {

  //for timer
  countDown: Subscription;
  counter:number;
  tick = 1000;

  answer:any = [];
  soal:any = [];
  api_url = environment.api_url;
  soalLength:number;
  nomorSoal= 1;

  id:number;
  durasi:number;

  constructor(private http: HttpClient,
              private other: OtherService,
              private route: ActivatedRoute,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private auth: AuthService, ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.id = params['id']
      this.durasi = params['durasi']
    })

    this.getSoal().subscribe();
    this.startTimer()

  }

  startTimer(){
    this.counter = this.durasi*60;
    // this.counter = 5;
    this.countDown = timer(0, this.tick)
      .subscribe(() => {
        --this.counter
        
          if(this.counter < 0){
            
            this.timeOver();
          }
        })
  }

  ngOnDestroy() {
    this.countDown = null;
  }

  checkAnswer(answer, index){
    if(this.answer [index]){
      this.answer.splice(index, 1)
    }else{
      this.answer[index] = answer;
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
    // const idJadwal = this.route.snapshot.params.id;
    return this.http.get(`${this.api_url}/api/start_exam/get_soal/${this.id}`)
    .pipe(
      tap(res => {
        if (res['error']) {
          this.other.showAlert('Kesalahan', res['message']);
        }else{
          this.soal = res['soal'];
          this.soalLength = this.soal.length;
        }
      }), 
    catchError(e => {
      this.other.showAlert('Kesalahan', e.error.message);
      throw new Error(e);
    })
    );
  }

  timeOver() {
    this.countDown.unsubscribe();
    let alert = this.alertCtrl.create({
      header: 'Perhatian',
      message: 'Waktu anda Sudah Habis, Ujian Akan Diselesaikan.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.hitungHasil();
        }
      }
      ]
    });

    alert.then(alert => alert.present());
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
      if(item.jawaban.toUpperCase() != this.answer[item.nomor-1]){
        console.log(item.jawaban)
        jawabanSalah++;
      }else{
        console.log(item.jawaban)
        jawabanBenar++;
      }
    });

    const scorePerPoin = 100/this.soalLength;
    const nilai = Math.ceil(jawabanBenar*scorePerPoin);
    
    this.simpanHasilUjian(jawabanBenar, jawabanSalah, nilai).subscribe();

  }

  simpanHasilUjian(benar, salah, score){
    // const idJadwal = this.route.snapshot.params.id;
    const userid = this.auth.user;
    const hasil = {
      benar: benar,
      salah: salah,
      score: score,
      id_jadwal: this.id,
      id_user: userid.sub
    }

    return this.http.post(`${this.api_url}/api/post_exam`, hasil).pipe(
      tap(res=>{
        if(res['error']){
          this.other.showAlert('Kesalahan', res['message'])
        }else{
          this.other.showAlert('Sukses', res['message'])
          this.navCtrl.navigateForward('/starter');
        }
      }),
      catchError(e => {
        this.other.showAlert('Kesalahan', e.error.message);
        throw new Error(e);
      })

    );
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

@Pipe({ name: 'formatTime'})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
