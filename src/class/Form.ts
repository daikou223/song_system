export class Form{
  items:FormItem[]
  title:string
  constructor(title:string,items?:FormItem[],datas?:any[]){
    this.items = items ?? []
    this.title = title
  }
}

class FormItem{
  key:string
  title:string
  req:boolean
  className:string
  constructor(key:string,title:string,req?:boolean){
    this.key = key
    this.title = title
    this.req = req ?? false
    this.className = FORM_CLASS.FORM_ITEM
  }
}

export class TextItem extends FormItem{
  constructor(key:string,title:string,req?:boolean){
    super(key,title,req)
    this.className = FORM_CLASS.TEXT_ITEM
  }
}

export class Select extends FormItem{
  selection:string[]
  constructor(key:string,title:string,selection:string[],req?:boolean,){
    super(key,title,req)
    this.selection = selection
    this.className = FORM_CLASS.SELECT_ITEM
  }
}

export const FORM_CLASS = {
  FORM_ITEM:"FORM_ITEM",
  TEXT_ITEM:"TEXT_ITEM",
  SELECT_ITEM:"SELECT_ITEM"
}