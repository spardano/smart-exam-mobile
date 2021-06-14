import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hasil-ujian',
  templateUrl: './hasil-ujian.page.html',
  styleUrls: ['./hasil-ujian.page.scss'],
})
export class HasilUjianPage implements OnInit {

  api_url = environment.api_url;
  results;

  constructor(private http: HttpClient,
              private other: OtherService,
              private auth: AuthService) { }

  ngOnInit() {
    this.getExamResult().subscribe();
  }

  getExamResult(){
    const userId = this.auth.user.sub;
    return this.http.get(`${this.api_url}/api/get_result/ ${userId}`)
    .pipe(
      tap(res => {
        if(res['error']){
          this.other.showAlert('Kesalahan', res['message'])
        }else{
          this.results = res['results'];
        }
      }),
      catchError(e => {
        this.other.showAlert('Kesalahan', e.error.message);
        throw new Error(e);
      })
    )
  }

}
