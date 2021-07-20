import {Component, OnInit} from '@angular/core';
import {SpotifyService} from "./spotify.service";
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
  tracks: Track[] = [];
  tracksQueue: TrackPack[] = [];
  trackCurrent: TrackCurrent = new TrackCurrent();
  isFull: boolean = false;
  isRepeat: boolean = false;
  whatPercent: number = 0;
  counterVote: number = 0;
  songTimeInterval: number = 0;
  isAllowVote: boolean = false;
  searchFilter: any = '';

  constructor(private userService: SpotifyService){
  }


  ngOnInit(): void {
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
        if(data!=null) {
          this.trackCurrent = data;
        }
        this.setTimeOfCurrentSong();

        if(this.msToTime(this.trackCurrent.durationMs)>=this.msToTime(this.trackCurrent.progressMs-9000)){
          if(this.tracksQueue.length!=0) {
            this.userService.addSong(this.tracksQueue[0].trackJson);
            this.userService.clearVote();
          }else{
            this.userService.clearVote().subscribe(()=>{
            })
          }
        }
      },);


    },2000);

    setInterval(() => {
      this.updateList();
      if(localStorage.getItem('currentUp') === null || isNaN(Number(localStorage.getItem('currentUp')))){
        localStorage.setItem('currentUp',String(this.songTimeInterval));
      }else {
<<<<<<< HEAD
        if(this.songTimeInterval>=30){
          this.isAllowVote = true;
          if(this.isAllowVote){
            this.songTimeInterval = 30;
=======
        if(this.num>=30){
          this.czyMozeszVote = true;
          if(this.czyMozeszVote){
            this.num = 30;
>>>>>>> 71ab526f34d3132cab551d1e5433447fb20f03be
            localStorage.removeItem('currentUp');
            localStorage.setItem('currentUp', String(this.songTimeInterval));
          }
        }else {
          this.songTimeInterval = Number(localStorage['currentUp']);
          this.songTimeInterval = this.songTimeInterval + 3;
          localStorage.setItem('currentUp', String(this.songTimeInterval));
        }
      }
      },3000);
  }

  updateList(){
    this.userService.getQueue().subscribe((data => {
      this.tracksQueue = data;
    }))
    this.userService.getVote().subscribe((data)=>{
      this.counterVote = data;
    })
  }

  addSongToQueueWeb(track: Track){
    this.isRepeat = false;
    this.tracksQueue.forEach(data=>{
      if(data.trackJson.uri == track.uri){
        this.isRepeat = true;
      }
    });

    if(this.tracksQueue.length<=9 && !this.isRepeat) {
      this.userService.addSongToQueue(track).subscribe(data => {
        this.updateList();
        if(this.tracksQueue.length>=9){
          this.isFull = true;
        }
      });
    }

  }
  deleteSongFromQueueWeb(track: Track){
    this.userService.deleteSongQueue(track).subscribe(data=>{
      this.isFull = false;
      this.updateList();
    })
  }
  setTimeOfCurrentSong(){
    this.whatPercent = this.trackCurrent.durationMs/this.trackCurrent.progressMs*100;

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
  addSongCounter(track: Track){
    if(this.isAllowVote) {
      this.songTimeInterval = 0
      this.addSongToQueueWeb(track);
      localStorage.setItem('currentUp', String(this.songTimeInterval));
      this.isAllowVote = false;
    }
  }
}
