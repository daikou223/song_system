import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../org/SideMenu";
import Home from "../org/mainPage/HomeScreen";
import SetList from "../org/mainPage/SetList";
import { Song } from "../class/Song.ts";
import { HistoryClass } from "../class/History.ts";
import InfomAtom from "../atom/InfomAtom.jsx";
import { getSongWithId } from "../fs/songfs.ts";
import { backSelectScreen, setDetail } from "../store/screenSlice.js";
import { SCREEN_ID } from "../CONST.js";
import { useEffect, useState } from "react";
import Loading from "../atom/Loading.jsx";

export default function DetailScreen() {
  const dispach = useDispatch();
  const songId = useSelector(
    (state) => state.screen.detailId[SCREEN_ID.SONG_DETAIL],
  );
  const [song, setSong] = useState(null);
  const userId = useSelector((state) => state.screen.userId)
  useEffect(() => {
    const fetchsong = async () => {
      const res = await getSongWithId(songId,userId);
      setSong(res);
    };
    fetchsong();
  }, []);

  if(!song) return(<div style={styles.detailWrapper}>
    <div style={{ backgroundColor: "#aaaaaa" }}>
        <button
          style={{ width: 120, height: 30, margin: 10 }}
          onClick={() => back(dispach)}
        >
          &lt; 一覧に戻る
        </button>
        <div style={{ display: "flex" }}>
        </div>
      </div>
    <Loading/>
    </div>)
  return (
    <div style={styles.detailWrapper}>
      <div style={{ backgroundColor: "#aaaaaa" }}>
        <button
          style={{ width: 120, height: 30, margin: 10 }}
          onClick={() => back(dispach)}
        >
          &lt; 一覧に戻る
        </button>
        <div style={{ display: "flex" }}>
          <div style={{ fontSize: 28, padding: 10 }}>{song.title}</div>
          <div style={{ fontSize: 18, marginTop: 25 }}>{song.artist}</div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {/* <LeftInfom song={song} /> */}
        <RightInfom song={song} />
      </div>
    </div>
  );
}

function LeftInfom({ song }) {
  return (
    <div style={{ width: "50%", padding: 10 }}>
      <InfomAtom title={"音源URL"} body={song.music} />
      <InfomAtom title={"歌詞URL"} body={song.risics} />
    </div>
  );
}

function RightInfom({ song }) {
  return (
    <div style={{ padding: 10 }}>
      <div>
        <InfomAtom title={"履歴"} body={HistoryComp(song.historys)} />
      </div>
      <div>
        <InfomAtom title={"メモ"} body={memoComp(song.historys)} />
      </div>
    </div>
  );
}
function HistoryComp(historys) {
  const sortedHistorys = historys.sort((h1, h2) => h2.date - h1.date);
  return (
    <div>
      <div tyle={{ fontSize: 18 }}>全{sortedHistorys.length}件</div>
      <div style={{ paddingLeft: 10 }}>
        {sortedHistorys.map((h) => {
          return (
            <div>
              {`${h.date.getFullYear()}/${h.date.getMonth()+1}/${h.date.getDate()}`}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function memoComp(historys) {
  const sortedHistorys = historys.sort((h1, h2) => h2.date - h1.date);
  return (
    <div>
      <div style={{ fontSize: 18 }}>全{sortedHistorys.filter((h)=>(h.memo.length !== 0)).length}件</div>
      <div style={{ paddingLeft: 10 }}>
        {sortedHistorys.map((h) => {
          if (h.memo.length == 0) return <div></div>;
          return (
            <div style={{ display: "flex" }}>
              <div style={{ fontSize: 18 }}>{h.memo}</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                (
                {`${h.date.getFullYear()}/${h.date.getMonth()+1}/${h.date.getDate()}`}
                )
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function back(dispach) {
  dispach(backSelectScreen());
}
function getSong(id) {
  const s = getSongWithId(id);
  return s;
}
const styles = {
  detailWrapper: {
    height: "100%",
  },
};
