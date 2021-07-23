import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Track} from "../domain/Track";
import {TrackCurrent} from "../domain/TrackCurrent";
import {catchError, retry, tap} from "rxjs/operators";
import {TrackPack} from "../domain/TrackPack";


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private url: string;

  constructor(private http: HttpClient) {
    // this.url = 'https://remiza-backend.herokuapp.com';
    this.url = 'http://localhost:8080'
  }

  getSongs(): Observable<Track[]> {
    return this.http.get<Track[]>(this.url+'/song/getSongs');
  }

  public addSong(track: Track) {
    console.log(track.name)
    return this.http.post(this.url+'/song',track).subscribe((data)=>{
      console.log("BŁĄD: ",data)
    })
  }
  public addSongToQueue(track: Track) {
    console.log(track)
    return this.http.post<TrackPack>(this.url+'/queue',track);
  }
  getQueue(): Observable<TrackPack[]> {
    return this.http.get<TrackPack[]>(this.url+'/queue');
  }

  deleteSongQueue(track: Track) {
    return this.http.delete<Track>(this.url+'/queue/'+track.name);
  }

  getCurrentTrack() {
    return this.http.get<TrackCurrent>(this.url+'/song/current');
  }
  public sendVote(){
    return this.http.post<number>(this.url+'/queue/vote',1);
  }
  getVote(){
    return this.http.get<number>(this.url+'/queue/vote');
  }
  clearVote(){
    return this.http.get(this.url+'/queue/clearVote');
  }
  skip(){
    return this.http.get(this.url+'/queue/skip');
  }
}
