import { useDispatch, useSelector } from "react-redux";
import { setSelectedScreen, setDetail, setReloadCount } from "../store/screenSlice";
import { SCREEN_ID } from "../CONST";
import { useEffect, useState } from "react";
import TextInput from "./InputAtom/TextInput";
import { TextItem } from "../class/Form.ts";
import dayjs from "dayjs";
import { getSetList, postHistory, postSetList, putSetList } from "../fs/songfs.ts";

const isMobile = window.innerWidth < 768;

export default function Songcomp({ song,setlistData }) {
  const dispatch = useDispatch();
  const [operMenuId, setOperMenu] = useState(MENU_ID.NONE);
  const todayString = dayjs().format("YYYY-MM-DD");
  const [historyDatas, setHistoryDatas] = useState({
    date: todayString,
  });
  const [setListState, setSetListState] = useState();
  const userId = useSelector((state)=>state.screen.userId)
  useEffect(() => {
    setSetListState(setlistData.map((setList)=>{
    const isInclude = !!setList.songs.find((s) => {
      return s.id == song.id;
    });
    return { id:setList.id,title:setList.title, isInclude: isInclude }}));
  }, [userId,setlistData]);
  return (
    <div style={styles.songWrapper}>
      <div style={styles.songHeader}>
        <div style={styles.songTitle}>{song.title}</div>
        <div style={styles.songArtist}>({song.artist})</div>
        <div style={isMobile? {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginLeft: 0,
  }:styles.buttons}>
          <button
            style={styles.plusRireki}
            onClick={() => openHistory(setOperMenu)}
          >
            +履歴
          </button>
          <button style={styles.plusSetori} onClick={() => openSetList(setOperMenu,setSetListState,song,userId,setListState)}>+セトリ</button>
          <button
            style={styles.detail}
            onClick={() => goDetail(song, dispatch)}
          >
            詳細表示
          </button>
        </div>
      </div>
      <div style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
  }}>
        <div style={styles.counter}>
          歌った回数:{song.sing_count ?? 0}回
        </div>
        <div style={styles.counter}>
          最終歌唱日:{song.last_sung_at.substr(0,10) ?? 0}
        </div>
      </div>
      {createOperMenu(operMenuId, historyDatas,setHistoryDatas,setListState, setSetListState, song,userId,dispatch,setOperMenu)}
    </div>
  );
}

function openHistory(setOperMenu) {
  setOperMenu((prev)=>prev == MENU_ID.HISTORY ? MENU_ID.HOME:MENU_ID.HISTORY)
}

function openSetList(setOperMenu,setSetListStete,song,userId,setListState) {
  setOperMenu((prev)=>prev == MENU_ID.SETLIST ? MENU_ID.HOME:MENU_ID.SETLIST)
}

const MENU_ID = {
  NONE: 0,
  HISTORY: 1,
  SETLIST: 2,
};

function createOperMenu(menuId, historyDatas,setHistoryDatas,setListState, setSetListState, song,userId,dispatch,setOperMenu) {
  if (menuId == MENU_ID.NONE) {
    return <div></div>;
  }
  if (menuId == MENU_ID.HISTORY) {
    return (
      <div
        style={{ display: isMobile? "":"flex", borderTop: "1px solid gray", marginTop: 10 }}
      >
        <div style={{ margin: isMobile ? 0:10 }}>履歴に追加</div>
        <div style={{ margin: isMobile ? 0:10 }}>日付</div>
        <input
          type="date"
          value={historyDatas.date}
          onChange={(e) => {
            setHistoryDatas((prev) => ({ ...prev, date: e.target.value }));
          }}
          style={{ marginTop: isMobile ? 0:10, marginBottom: 10 }}
        />
        <div style={{ margin: isMobile ? 0:10 }}>メモ</div>
        <input
          type="text"
          value={historyDatas.memo ?? ""}
          onChange={(e) => {
            setHistoryDatas((prev) => ({ ...prev, memo: e.target.value }));
          }}
          style={{ marginTop: isMobile ? 0:10, marginBottom: 10 }}
        />
        {isMobile && <br/>}
        <button
          style={{ margin: isMobile ? 0:10, width: isMobile ? "80%":120 }}
          onClick={async() => await clickHistory(song.id, historyDatas.date, historyDatas.memo ?? "",userId,dispatch,setOperMenu,setHistoryDatas)}
        >
          登録
        </button>
      </div>
    );
  }
  if (menuId == MENU_ID.SETLIST) {
    const formatedSetListCheckBox = [];
    const size = isMobile ? 1:4;
    for (
      let setListIndex = 0;
      setListIndex < setListState.length;
      setListIndex += size
    ) {
      const sliced = setListState.slice(setListIndex, setListIndex + size);
      formatedSetListCheckBox.push(sliced);
    }

    function handleCheckBox(id) {
      setSetListState((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isInclude: !s.isInclude } : s)),
      );
    }
    return (
      <div>
        {formatedSetListCheckBox.map((setListRow) => {
          return (
            <div style={{ display: "flex", height: 50 }}>
              {setListRow.map((setList) => {
                return (
                  <div
                    style={{
                      width: isMobile?"80%":"20%",
                      margin: "2%",
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "90%",overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis" }}>{setList.title}</div>
                    <input
                      type="checkbox"
                      checked={setList.isInclude}
                      onChange={() => handleCheckBox(setList.id)}
                      style={{ width: 20, height: 20 }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
        <button
          style={{ margin: 20, width: isMobile? "80%":120 }}
          onClick={() => {putSetList(song, setListState,dispatch);setOperMenu(MENU_ID.NONE)}}
        >
          登録
        </button>
      </div>
    );
  }
}
function goDetail(song, dispatch) {
  dispatch(setSelectedScreen(SCREEN_ID.SONG_DETAIL));
  dispatch(setDetail(song.id));
  return <></>;
}
async function clickHistory(songId, date, memo,userId,dispatch,setOperMenu,setHistoryDatas){
  const todayString = dayjs().format("YYYY-MM-DD");
  await postHistory(songId, date, memo ?? "",userId,dispatch)
  setOperMenu(MENU_ID.NONE)
  dispatch(setReloadCount())
  setHistoryDatas({date:todayString})
}


const styles = {
  songWrapper: {
    width: "96%",
    marginRight: "2%",
    marginLeft: "2%",
    border: "2px solid black",
    backgroundColor: "#99CCCC",
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    boxSizing: "border-box",
  },
  songTitle: {
    fontSize: 22,
    marginRight: 10,
    whiteSpace: "nowrap",
    overflow: "hidden",
    width: isMobile ? "100%":"40%",
  },
  songArtist: {
    fontSize: 16,
    marginTop: 5,
    whiteSpace: "nowrap",
    overflow: "hidden",
     width: isMobile ? "100%":"20%"
  },
  songHeader: {
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
},
  buttons: {
    marginLeft: "auto",
    width: "30%",
  },
  subInfom: {
    display: "flex",
  },
  plusRireki: {
    marginRight: "3%",
    height: "120%",
    width: isMobile ? "25%":"30%",
  },
  plusSetori: {
    marginRight: "3%",
    height: "120%",
    width: isMobile ? "25%":"30%",
  },
  detail: {
    marginRight: "3%",
    height: "120%",
    width: isMobile ? "25%":"30%",
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
