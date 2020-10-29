import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  files: Array<any> = [
    { name: "First Song", artist: "Inder" },
    { name: "Second Song", artist: "You" },
    { name: "Second Song", artist: "You" },
    { name: "Second Song", artist: "You" }
  ];
  state;
  currentFile: any = {};

  isFirstPlaying() {
    return false;
  }
  isLastPlaying() {
    return true;
  }

  openFile(){

  }

  onSliderChangeEnd(event){

  }

  previous(){

  }

  play(){

  }

  pause(){

  }

  next(){
    
  }
}
