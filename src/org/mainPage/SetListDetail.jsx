import { useDispatch, useSelector } from "react-redux";
import { getSetListWithId, postSetListWithId } from "../../fs/songfs.ts";
import { styles } from "./mainPageCss.js";
import SongList from "../../molcule/SongList";
import { baseURL, SCREEN_ID } from "../../CONST.js";
import { useEffect, useState } from "react";
import Loading from "../../atom/Loading.jsx";
import { setSelectedScreen } from "../../store/screenSlice.js";

export default function SetListDetail() {
  const setListId = useSelector(
    (state) => state.screen.detailId[SCREEN_ID.SETLIST_DETAIL],
  );
  const [setListData, setSetListData] = useState(null);
  const [disabled, setDissable] = useState(false);
  const [buttonText, setButtonText] = useState("このセットリストを保存");
  const userId = useSelector((state) => state.screen.userId);
  const dispatch = useDispatch()
    const c = useSelector((state)=>state.screen.reloadCount)
  useEffect(() => {
    (async () => {
      setSetListData(await getSetListWithId(setListId, userId));
    })();
  }, [c]);
  const savingSetlist = async () => {
    setDissable(true);
    const isSaving = await postSetListWithId(userId, setListId,dispatch);

    setSetListData((prev) => ({
      ...prev,
      is_saving: isSaving,
    }));
    setButtonText("保存に失敗しました");

    if (isSaving) {
      setSelectedScreen(SCREEN_ID.SETLIST);
    }
  };
  if (!setListData) return <Loading />;
  return (
    <div style={styles.globalWrapper}>
      <div style={styles.mainPageHeader}>
        <div style={styles.title}>
          {setListData.user_id !== userId
            ? `${setListData.user_name} さんの `
            : ""}
          {setListData.title}
        </div>
        {!setListData.is_saving && (
          <button
            disabled={disabled}
            style={{
              marginLeft: "auto",
              marginRight: 20,
              width: 200,
              height: 50,
            }}
            onClick={savingSetlist}
          >
            このセットリストを保存
          </button>
        )}
      </div>
      {setListData.user_id == userId && (
        <div style={{ paddingLeft: 20, fontSize: 16 }}>
          共有URL:{" "}
          <a
            href={`${baseURL}?setlistId=${setListId}&setlistKey=${setListData.shareKey}`}
            style={{
              color: "blue",
              width: "100%",
              wordBreak: "break-all",
            }}
          >
            {`${baseURL}?setlistId=${setListId}&setlistKey=${setListData.shareKey}`}
          </a>
        </div>
      )}
      <SongList songs={setListData.songs} />
    </div>
  );
}
