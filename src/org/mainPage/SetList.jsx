import { useDispatch, useSelector } from 'react-redux'
import SongList, { Song } from '../../molcule/SongList'
import { styles } from './mainPageCss.js'
import Loading from '../../atom/Loading';
import { getSetList, getSong } from '../../fs/songfs.ts';
import { setDetail, setSelectedScreen } from '../../store/screenSlice.js';
import { SCREEN_ID } from '../../CONST.js';
import { useEffect, useState } from 'react';

const isMobile = window.innerWidth < 768;

export default function SetList(){
  const userId = useSelector((state)=>state.screen.userId)
  const [setLists,setSetLists] = useState([])
   useEffect(() => {
    async function fetchSongs() {
      const result = await getSetList(userId,false);
      setSetLists(result);
    }
    fetchSongs();
  }, []);
  const dispatch = useDispatch()
    return (
      <div style={styles.globalWrapper}>
        <div style={styles.mainPageHeader}>
          <div style={styles.title}>セットリスト</div>
          <button onClick = {()=>dispatch(setSelectedScreen(SCREEN_ID.SETLIST_REGIST))} style = {styles.goRegistButton}> + セットリスト登録</button>
        </div>
        <SetListList setLists={setLists} />
      </div>
    );
  }

function SetListList({ setLists }) {
  if (setLists == undefined) {
    return <Loading />;
  }
  return (
    <div style={setListStyles.songListWrapper}>
      {setLists.map((setList) => {
        return <SetListComp setList={setList} />;
      })}
    </div>
  );
}

function SetListComp({ setList }) {
  console.log(setList)
  const dispach = useDispatch()
  return (
    <div style={setListCompStyles.songWrapper}>
      <div style={setListCompStyles.songHeader}>
        <div style={setListCompStyles.setlistTitle}>{setList.title}</div>
        <div style={setListCompStyles.buttons}>
          <button style={setListCompStyles.detail} onClick = {()=>goListDetail(setList,dispach)}>詳細表示</button>
        </div>
      </div>
      <div style={setListCompStyles.subInfom}>
        {setList.is_saving ? createSongList(setList.songs):`(${setList.user_name})`}
      </div>
    </div>
  );
}

function goListDetail(setList,dispach){
  dispach(setSelectedScreen(SCREEN_ID.SETLIST_DETAIL))
  dispach(setDetail(setList.id))
}

function createSongList(songs){
  if(songs.length > 10){
    return(songs
              .slice(0, 10)
              .map((s) => s.title)
              .join(",")  + `...他${songs.length-10}曲`)
  }
  return(
    songs.map((s) => s.title).join(",")
  )
}

const setListStyles = {
  counts: {
    fontSize: 18,
    paddingLeft: 10,
  },
  songListWrapper: {
    paddingBottom: 20,
  },
};

const setListCompStyles = {
  songWrapper: {
    width: "96%",
    marginRight: "2%",
    marginLeft: "2%",
    border: "2px solid black",
    backgroundColor: "#bbaaff",
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    boxSizing: "border-box",
  },
  setlistTitle: {
    fontSize: 16,
    marginRight: 10,
    width:230,
     overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
  },
  songArtist: {
    fontSize: 16,
    marginTop: 5,
  },
  songHeader: {
    display: "flex",
  },
  buttons: {
    marginLeft: "auto",
  },
  subInfom: {
    display: "flex",
  },
  plusSetori: {
    marginRight: 10,
    height: "100%",
    width: 120,
  },
  detail: {
    marginRight: 10,
    height: "100%",
    width: isMobile ? 80:120,
    fontSize:isMobile ? 12:14,
  },
  counter: {
    marginRight: 10,
  },
  music: {
    marginRight: 10,
  },
  risics: {
    marginRight: 10,
  },
};