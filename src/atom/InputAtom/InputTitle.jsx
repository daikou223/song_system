export default function InputTile({item}){
  return(
    <div style = {{width:"50%",padding:10,display: "flex",textAlign:"center" }}>
        <div>{item.title}</div>
        <div>{item.req ? "(必須)":""}</div>
      </div>
  )
}