import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-intro-exam',
  templateUrl: './intro-exam.page.html',
  styleUrls: ['./intro-exam.page.scss'],
})
export class IntroExamPage implements OnInit {

  id:number;
  detail_id:string;
  keterangan:string;
  tanggal_mulai:string;
  tanggal_akhir:string;
  jam_mulai:string;
  durasi:number;
  mapel:string;
  tingkat:number;

  detail_ujian:any;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private navCtrl: NavController) { 

    this.route.queryParams.subscribe(params => {
      this.id = params['id']
      this.keterangan = params['keterangan']
      this.tanggal_mulai = params['tanggal_mulai']
      this.tanggal_akhir = params['tanggal_akhir']
      this.jam_mulai = params['jam_mulai']
      this.durasi = params['durasi']
      this.mapel = params['mapel']
      this.tingkat = params['tingkat']
    })

  }

  ngOnInit() {
  }

  startExam(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.id,
        durasi: this.durasi,
      }
    }

    this.navCtrl.navigateForward(['/exam'], navigationExtras);

  }

}
