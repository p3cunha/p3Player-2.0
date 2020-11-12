import { Component, OnInit } from '@angular/core';

import { AudioService } from "../../services/audio.service";
import { CloudService } from "../../services/cloud.service";
import { StreamState } from "../../interfaces/stream-state";
import { userConfig } from 'src/app/interfaces/userConfig';




@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};
  navOpen = false;

  constructor(
    private audioService: AudioService,
    private cloudService: CloudService) { 
        // push media files from Cloud to files
      this.cloudService.returnFilesAsObservables().subscribe(files => this.files = files);
      // push state from audioService to state
      this.audioService.sendStateChangeToAllApp().subscribe(state => this.state = state);
    }

  isFirstPlaying() {
    return this.currentFile.index === 0
  }
  isLastPlaying() {
    return this.currentFile.index === this.files.length -1;
  }

  openFile(file, index){
    this.currentFile = { index, file }
    this.stop() // knows that stop by pipe takeUntil from playEventsByUrlUntilStop
    this.returnEventsOnNewFile(file.url)
  }

  onSliderChangeSongCurrentTime(sliderPosition){
    this.audioService.songTime(sliderPosition.value)
  }

  previous(){
    const index = this.currentFile.index - 1;
    const file = this.files[index]
    this.openFile(file, index);
  }

  play(){
    if (this.currentFile.index === undefined) { 
      const index = 0;
      const file = this.files[index]
      this.openFile(file, index);
      }
    this.audioService.play();
  }

  pause(){
    this.audioService.pause()
  }

  stop(){
    this.audioService.stop(); 
  }

  next(){
    const index = this.currentFile.index + 1;
    const file = this.files[index]
    this.openFile(file, index);
    
  }

  //events and values here dont are needed, cuz are read by sendStateChangeToAllApp
  //start observable and audio playback
  returnEventsOnNewFile(url){
    this.audioService.returnEventsOnNewFile(url).subscribe(events => { })
  }

  userConfig: userConfig[] = [
    {value: 'geren', viewValue: 'Gerenciar minha conta'},
    {value: 'viewConf', viewValue: 'Configurações de exibição'},
    {value: 'cntrSelec', viewValue: 'Seletor de país'}
  ];
}
