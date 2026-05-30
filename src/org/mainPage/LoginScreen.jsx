import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./mainPageCss.js";
import TextInput from "../../atom/InputAtom/TextInput";
import { setUserNameAsync } from "../../fs/songfs.ts";
import InputTile from "../../atom/InputAtom/InputTitle.jsx";
import { setSelectedScreen } from "../../store/screenSlice.js";
import { baseURL, SCREEN_ID } from "../../CONST.js";

export default function LoginScreen() {
  const userName = useSelector(
    (state) => state.screen.userName
  );

  const dispatch = useDispatch()
  const [name, setName] = useState(userName);
  const userHash = localStorage.getItem("userHash")
  return (
    <div style={styles.globalWrapper}>
      <div style={styles.mainPageHeader}>
        <div style={styles.title}>ユーザー設定</div>
      </div>

      <div style={{ display: "flex" }}>
            <InputTile item = {{title:"ユーザーネーム",req:true}}/>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              style = {{border:"none",borderBottom:"1px solid black",width:"40%"}}
              placeholder= {"ユーザーネーム"}
            />
          </div>
      <button
        style={styles.registButton}
        onClick={async() => {await setUserNameAsync(name,dispatch)}}
      >
        ユーザーネーム変更
      </button>

      <div style = {{width:"90%",margin:"5%"}}>他端末同期URL：
        <a
  href={`${baseURL}/?userHash=${userHash}`}
  style={{
    color: "blue",
    width: "100%",
    wordBreak: "break-all",
  }}
>
  {`${baseURL}/?userHash=${userHash}`}
</a>
        </div>
    </div>
  );
}
