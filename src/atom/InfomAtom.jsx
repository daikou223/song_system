export default function InfomAtom({title,body}){
  return(
    <div>
      <div style = {styles.titleWrapper}>{title}</div>
      <div style = {body.constructor.name == "String" ? styles.bodyWrapper:styles.ObjectBodyWrapper}>{body}</div>
    </div>
  )
}

const styles = {
  titleWrapper:{
    fontSize:24
  },
  bodyWrapper:{
    paddingLeft:10,
    fontSize:16,
    borderLeft:"1px solid #999999"
  },
  ObjectBodyWrapper:{
    paddingLeft:10,
    borderLeft:"1px solid #999999"
  }
}