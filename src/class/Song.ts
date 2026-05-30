import { HistoryClass } from "./History"

export class Song{
  id:number
  title:string
  artist:string
  music:string
  risics:string
  historys:HistoryClass[]
  last_sung_at:string
  constructor(id:number,title:string,artist:string,last_sung_at:string){
    this.id = id
    this.title = title
    this.artist = artist
    this.historys = []
    this.music = ""
    this.risics = ""
    this.last_sung_at = last_sung_at
  }
  setMusic(URL:string){
    this.music = URL
  }
  setRisics(URL:string){
    this.risics = URL
  }
  addHistory(history:HistoryClass){
    this.historys.push(history)
  }
}