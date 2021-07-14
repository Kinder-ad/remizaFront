import {Component, OnInit} from '@angular/core';
import {SpotifyServiceService} from "./spotify-service.service";
import {Track} from '../domain/Track';
import {TrackCurrent} from "../domain/TrackCurrent";
import {map} from "rxjs/operators";
import {TrackPack} from "../domain/TrackPack";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'RemizaFronte';
  tracks: Track[] = [];
  tracksQueue: TrackPack[] = [];
  trackCurrent: TrackCurrent;
  czyZapelniona: boolean;
  czyPowtarzaSie: boolean;
  kolejka: boolean;
  jakiprocent: Number;
  imie_wyszukane: any;
  wyszukiwarka: any;
  counterVote: number;
  num: number = 0;
  czyMozeszVote: boolean;
  constructor(private userService: SpotifyServiceService){
    this.tracks = [];
    this.tracksQueue = [];
    this.czyZapelniona = false;
    this.czyPowtarzaSie = false;
    this.trackCurrent = new TrackCurrent();
    this.kolejka = false;
    this.jakiprocent = 0;
    this.counterVote = 0;
    this.czyMozeszVote = false;
  }


  ngOnInit(): void {
    this.userService.authorize();
    this.userService.getSongs().subscribe((data => {
      this.tracks = data;
    }));
    this.userService.getQueue().subscribe((data => {
      this.tracksQueue = data;
    }))
    this.userService.getCurrentTrack().subscribe((data) =>{
      this.trackCurrent = data;
    })
    this.userService.getVote().subscribe((data)=>{
      this.counterVote = data;
    });
    setInterval(()=>{
      this.userService.getCurrentTrack().subscribe((data)=> {
        if(this.trackCurrent.name!=data.name){
          //odswiezenie vote
          this.userService.clearVote().subscribe();
        }
        this.trackCurrent = data;
        //progress bar
        this.setTimeOfCurrentSong();
        //odswiezenie listy
        this.updateList();

        if(this.msToTime(this.trackCurrent.durationMs)>=this.msToTime(this.trackCurrent.progressMs-9000)){
          this.userService.addSong(this.tracksQueue[0].trackJson);
        }
      });
      this.userService.getVote().subscribe((data)=>{
        this.counterVote = data;
      });
    },1000);


    setInterval(() => {
      if(localStorage.getItem('currentUp') === null || isNaN(Number(localStorage.getItem('currentUp')))){
        localStorage.setItem('currentUp',String(this.num));
      }else {
        if(this.num>=300 ){
          this.czyMozeszVote = true;
          if(this.czyMozeszVote){
            this.num = 300;
            localStorage.removeItem('currentUp');
            localStorage.setItem('currentUp', String(this.num));
          }
        }else {
          this.num = Number(localStorage['currentUp']);
          this.num = this.num + 1;
          localStorage.setItem('currentUp', String(this.num));
        }
      }
      },1000);
  }
  updateList(){
    this.userService.getQueue().subscribe((data => {
      this.tracksQueue = data;
    }))
    this.userService.getVote().subscribe((data)=>{
      this.counterVote
    })
  }
  addSongToQueueTab(track: Track){
    this.czyPowtarzaSie = false;
    this.tracksQueue.forEach(data=>{
      if(data.trackJson.name == track.name){
        this.czyPowtarzaSie = true;
      }
    });

    if(this.tracksQueue.length<=9 && !this.czyPowtarzaSie) {
      this.userService.addSongToQueue(track).subscribe(data => {
        this.updateList();
        if(this.tracksQueue.length>=9){
          this.czyZapelniona = true;
        }
      });
    }

  }
  deleteSongFromQueue(track: Track){
    this.userService.deleteSongQueue(track).subscribe(data=>{
      this.czyZapelniona = false;
      this.updateList();
    })
  }
  setTimeOfCurrentSong(){
    this.jakiprocent = this.trackCurrent.durationMs/this.trackCurrent.progressMs*100;

  }

  search() {
    if (this.imie_wyszukane !== ''){
      this.tracks = this.tracks.filter(data => {
        this.wyszukiwarka = data.name
        return this.wyszukiwarka
          .toLocaleLowerCase()
          .match(this.imie_wyszukane
            .replace(' ', '')
            .toLocaleLowerCase()
          );
      });
    }else if (this.imie_wyszukane === '') {
      this.ngOnInit();
    }
  }
  voteSkip() {
    if(localStorage.getItem('currentVote') === null){
      localStorage.setItem('currentVote',this.trackCurrent.name);
      this.userService.sendVote().subscribe((data) => {
        this.counterVote = data;
      });
    }else{
      if(this.trackCurrent.name != localStorage.getItem('currentVote')){
        localStorage.setItem('currentVote',this.trackCurrent.name);
        this.userService.sendVote().subscribe((data) => {
          this.counterVote = data;
        });
        }
      }
    // this.userService.sendVote().subscribe((data) => {
    //       this.counterVote = data;
    //     });
    }
   msToTime(duration: number) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds: any = Math.floor((duration / 1000) % 60),
      minutes: any = Math.floor((duration / (1000 * 60)) % 60),
      hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return  minutes + ":" + seconds ;
  }
  addVoteOnSong(name: string){
    if(this.czyMozeszVote) {
      this.userService.sendVoteOnSong(name).subscribe((data) => {
      })
      this.num = 0
      localStorage.removeItem('currentUp');
      localStorage.setItem('currentUp', String(this.num));
      this.czyMozeszVote = false;
    }
  }
}
