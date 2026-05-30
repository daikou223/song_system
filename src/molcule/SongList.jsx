import { useEffect, useState } from "react";
import Loading from "../atom/Loading"
import Songcomp from "../atom/SongComp"
import { getSetList } from "../fs/songfs.ts";
import { useSelector } from "react-redux";

export default function SongList({songs}){
  const userId = useSelector((state)=>state.screen.userId)
  const [setlistData,setSetlistData] = useState([])
  useEffect(() => {
    async function fetchList() {
      setSetlistData(await getSetList(userId));
    }
    fetchList();
  }, [userId]);
   if(songs == undefined){
    return(
      <Loading/>
    )
  }
  return(
    <div style = {styles.songListWrapper}>
      <div style = {styles.counts}>{songs.length ?? ""}件</div>
      {songs.map((song)=>{
        return(
          <Songcomp song = {song} setlistData = {setlistData}/>
        )
      })}
    </div>
  )
}


const styles = {
  counts:{
    fontSize:18,
    paddingLeft:10
  },
  songListWrapper:{
    paddingBottom:20
  }
}