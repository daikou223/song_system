export class HistoryClass{
  date:Date
  memo:string
  constructor(date:string,memo:string){
    this.date = new Date(date)
    this.memo = memo
  }
}