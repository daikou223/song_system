import { useSelector } from "react-redux";
import { styles } from "./mainPageCss.js";
import SongList from "../../molcule/SongList";
import { getHistory } from "../../fs/songfs.ts";
import { useEffect, useState } from "react";

export default function History() {
  const [selectedSort, setSelectedSort] = useState("new");
  const [songs,setSongs] = useState([])
  const userId = useSelector((state)=>state.screen.userId)
  useEffect(() => {
      async function fetchSongs() {
        const result = await getHistory(selectedSort,userId);
        setSongs(result);
      }
      fetchSongs();
    }, [selectedSort]);
  return (
    <div style={styles.globalWrapper}>
      <div style={styles.mainPageHeader}>
        <div style={styles.title}>履歴</div>
        <select
          style={styles.saerch}
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="new">新しい順</option>
          <option value="more">歌唱回数が多い順</option>
          <option value="low">歌唱回数が少ない順</option>
        </select>
      </div>
      <SongList songs={songs} />
    </div>
  );
}
