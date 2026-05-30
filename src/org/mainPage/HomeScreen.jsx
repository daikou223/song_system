import { useDispatch, useSelector } from "react-redux";
import SongList from "../../molcule/SongList";
import { styles } from "./mainPageCss.js";
import { Song } from "../../class/Song.ts";
import { getSong } from "../../fs/songfs.ts";
import { setSelectedScreen } from "../../store/screenSlice.js";
import { SCREEN_ID } from "../../CONST.js";
import { useEffect, useState } from "react";

export default function Home() {
  const [songs, setSong] = useState([]);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const userId = useSelector((state) =>state.screen.userId)
  const c = useSelector((state)=>state.screen.reloadCount)

  useEffect(() => {
    async function fetchSongs() {
      const result = await getSong(userId);
      setSong(result);
    }
    fetchSongs();
  }, [c,userId]);
  return (
    <div style={styles.globalWrapper}>
      <div style={styles.mainPageHeader}>
        <div style={styles.title}>ホーム</div>
        <button
          onClick={() => dispatch(setSelectedScreen(SCREEN_ID.SONG_REGIST))}
          style={styles.goRegistButton}
        >
          + 曲登録
        </button>
      </div>
       <input
          type="text"
          placeholder="検索"
          style={styles.saerch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (async() =>{setSong(await getSong(userId,searchText))})();
            }
          }}
        />
      <SongList songs={songs} />
    </div>
  );
}
