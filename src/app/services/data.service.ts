import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { WitMessageResponse } from '../interfaces/IWit';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private witAPI = env.wit.api;
  private version = env.wit.version;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.wit.token}`
  });

  constructor(private http: HttpClient) { }

  getWitMessage(message: string): Observable<WitMessageResponse> {
    return this.http.get<WitMessageResponse>(this.witAPI + 'message?v=' + this.version + '&q=' + message, { headers: this.headers }).pipe(map((response) => response));
  }

}
