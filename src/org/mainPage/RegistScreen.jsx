import { useDispatch, useSelector } from "react-redux";
import { SCREEN_ID } from "../../CONST";
import { Form, FORM_CLASS, Select, TextItem } from "../../class/Form.ts";
import { useEffect, useState } from "react";
import Loading from "../../atom/Loading.jsx";
import { styles } from "./mainPageCss.js";
import TextInput from "../../atom/InputAtom/TextInput.jsx";
import SelectInput from "../../atom/InputAtom/SelectInput.jsx";
import { login, postSetList, postSong } from "../../fs/songfs.ts";
import { setSelectedScreen, setUserId, setUserName } from "../../store/screenSlice.js";

export default function RegistScreen() {
  const selectedScreens = useSelector((state) => state.screen.selectedScreen);
  const selectedScreen = selectedScreens[selectedScreens.length-1];
  const [datas, setDatas] = useState({});
  const dispatch = useDispatch()
  const userName = useSelector((state)=>state.screen.userUserName)
  const userId = useSelector((state)=> state.screen.userId)

  const form = itemBuilder(selectedScreen,userName);
  useEffect(()=>{
    datasInit(setDatas, form);
  },[])

  if(!form)return(<Loading/>)
  return (
    <div style = {styles.globalWrapper}>
      <div style = {styles.mainPageHeader}>
      <div style = {styles.title}>{form.title}</div>
      </div>
      {form.items.map((item) => {
        return(jsxBulder(item, datas, setDatas));
      })}
      {buttonBuilder(selectedScreen,datas,dispatch,userId)}
    </div>
  );
}

function datasInit(setDatas, items) {
  if(!items) return {}
  const stateData = {};
  items.items.forEach((i) => {
    switch (i.className) {
      case FORM_CLASS.TEXT_ITEM:
        stateData[i.key] = "";
        break;
      case FORM_CLASS.SELECT_ITEM:
        stateData[i.key] = i?.selection[0] ?? null;
        break;
    }
  });
  setDatas(stateData);
}

function itemBuilder(selectedScreen,userName) {
  switch (selectedScreen) {
    case SCREEN_ID.SONG_REGIST:
      return new Form("曲登録",[
        new TextItem("songName", "曲名", null,true),
        new TextItem("artist", "アーティスト名", null,true),
      ]);
    case SCREEN_ID.SETLIST_REGIST:
      return new Form("セットリスト登録",[
        new TextItem("setListName", "セットリスト名", true),
      ]);
    case SCREEN_ID.LOGIN:
      return new Form("ユーザーメニュー",[
        new TextItem("userName", "ユーザーネーム", userName,true),
      ]);
  }
}

function jsxBulder(item, datas, setDatas) {
  switch (item.className) {
    case FORM_CLASS.TEXT_ITEM:
      return (
        <TextInput item={item} datas = {datas} setDatas = {setDatas}/>
      );
    case FORM_CLASS.SELECT_ITEM:
      return(
        <SelectInput item={item} datas = {datas} setDatas = {setDatas}/>
      );
  }
}

function buttonBuilder(screenSelector,data,dispach,userId){
  switch(screenSelector){
    case SCREEN_ID.LOGIN:
      return(
        <button style = {styles.registButton} onClick={()=>{}}>ユーザーネーム変更</button>
      )
    case SCREEN_ID.SETLIST_REGIST:
      return(<button style = {styles.registButton} onClick={()=>setSetList(data,dispach,userId)}>登録</button>)
    case SCREEN_ID.SONG_REGIST:
      return(<button style = {styles.registButton} onClick={()=>setSong(data,dispach)}>登録</button>)
  }
}


function setSetList(data,dispatch,userId){
  const isSuc = postSetList(data,userId,dispatch)
}

function setSong(data,dispatch){
  const isSuc = postSong(data,dispatch)
}

