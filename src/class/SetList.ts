import { Song } from "./Song.ts";

export class SetListClass {
  id:number
  title:string;
  songs:any[];
  shareKey:string
  user_id:number
  user_name:string
  is_saving:boolean
  constructor(id:number,title:string,shareKey:string,user_id:number,user_name:string,is_saving:boolean) {
    this.id = id
    this.title = title;
    this.songs = [];
    this.shareKey = shareKey
    this.user_id = user_id
    this.user_name = user_name
    this.is_saving = is_saving
  }
  addSong(song:any) {
    this.songs.push(song);
  }
}