import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";

import { StreamState } from '../interfaces/stream-state';


@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();//subject:observable and observer. Eventemitter
  private audioObj = new Audio(); //HTML audio element
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  //whenever play new audio file, all these events are trigged by playEventsByUrlUntilStop$() 
  private returnEventsWheneverNewFile(url) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();
  
      const handleWithAudioEvents = (event: Event) => { 
        this.audioEventsUpdatenInitialStateAndPutOnStateChange(event) 
        observer.next(event); //push event to observable
      };
    
      //
    this.addEvents(this.audioObj, this.audioEvents, handleWithAudioEvents); // on new event
      
    //and return these events when played new file
      return () => {
        // Stop Playing
        this.audioObj.pause();  
        this.audioObj.currentTime = 0; // time to 0
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handleWithAudioEvents);
         // reset initialState
        this.resetToInitialState();
      };
    });
  }

    private addEvents(obj, events, handleWithAudioEvents) {
      events.forEach(event => { // each event trigger a handleWithAudioEvents
        obj.addEventListener(event, handleWithAudioEvents); // add event on audioObj
      });
    }
  
    private removeEvents(obj, events, handleWithAudioEvents) { //remove event
      events.forEach(event => { // each event trigger a handleWithAudioEvents
        obj.removeEventListener(event, handleWithAudioEvents); // remove event of audioObj
      });
    }

  //receive value of returnEventsWheneverNewFile
  //pipe brings the method 'takeUntil' to be applied on value from Observable
    playEventsByUrlUntilStop$(url) {
      return this.returnEventsWheneverNewFile(url).pipe(takeUntil(this.stop$));
    }

    play(){
      this.audioObj.play()
    }

    pause() {
      this.audioObj.pause();
    }
  
    stop() {
      this.stop$.next();
    }

    seekTo(seconds) {
      this.audioObj.currentTime = seconds;
    }

    //using formatTime of 'moment'
    formatTimeWithMoment(time: number, format: string = "HH:mm:ss") {
      const momentTime = time * 1000;
      return moment.utc(momentTime).format(format);
    }

      // Emit initialState Changes
  //initial initialState
  private initialState: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  //BehaviorSubject - require initial value = initialState, change whenever subscribed
  //subcribed on audioEventsUpdatenInitialStateAndPutOnStateChange
  private stateChange: 
  BehaviorSubject<StreamState> = new BehaviorSubject(this.initialState);

  //update stateChange based on audioEvents
  private audioEventsUpdatenInitialStateAndPutOnStateChange(event: Event): void {
    switch (event.type) {
      case "canplay": //audioEvent
        this.initialState.duration = this.audioObj.duration;
        this.initialState.readableDuration = this.formatTimeWithMoment(this.initialState.duration);
        this.initialState.canplay = true;
        break;

      case "playing": //audioEvent
        this.initialState.playing = true;
        break;
        case "pause": //audioEvent
        this.initialState.playing = false;
        break;

      case "timeupdate": //audioEvent
        this.initialState.currentTime = this.audioObj.currentTime;
        this.initialState.readableCurrentTime = this.formatTimeWithMoment(
          this.initialState.currentTime
        );
        break;

      case "error":
        this.resetToInitialState();
        this.initialState.error = true;
        break;
    }
    this.stateChange.next(this.initialState); // push initialState alteration into stateChange
  }

  resetToInitialState(){
    this.initialState = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
    }
  }

  //pass stateChange (Subject) as Observable
  sendStateChangeToAllApp(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }



}




