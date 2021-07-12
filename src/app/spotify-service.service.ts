import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Track} from "../domain/Track";
import {TrackCurrent} from "../domain/TrackCurrent";
import {tap} from "rxjs/operators";
import {TrackPack} from "../domain/TrackPack";


@Injectable({
  providedIn: 'root'
})
export class SpotifyServiceService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:8080';
  }

  getSongs(): Observable<Track[]> {
    return this.http.get<Track[]>(this.url+'/getSongs');
  }

  public addSong(track: Track) {
    console.log(track.name)
    return this.http.post(this.url+'/song/add/',track).subscribe((data)=>{
      console.log("BŁĄD: ",data)
    })
  }
  public addSongToQueue(track: Track) {
    console.log(track)
    return this.http.post<TrackPack>(this.url+'/song',track);
  }
  getQueue(): Observable<TrackPack[]> {
    return this.http.get<TrackPack[]>(this.url+'/getQueue');
  }

  deleteSongQueue(track: Track) {
    return this.http.delete<Track>(this.url+'/song/queue/'+track.name);
  }

  getCurrentTrack() {
    return this.http.get<TrackCurrent>(this.url+'/song/current');
  }
  public sendVote(){
    return this.http.get<number>(this.url+'/song/queue/skipvote');
  }
  getVote(){
    return this.http.get<number>(this.url+'/song/queue/getvote');
  }
  authorize(){
    return this.http.get<number>(this.url+'/aut');
  }
  clearVote(){
    return this.http.get(this.url+'/song/queue/clearVote');
  }

  sendVoteOnSong(name: string) {
    return this.http.get(this.url+'/song/queue/'+name);
  }

}
