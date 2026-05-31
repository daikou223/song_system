import { useEffect, useState } from "react";
import Footer from "./org/Footer";
import Header from "./org/Header";
import WithSiteScreen from "./screens/WithSiteScreen";
import { useDispatch, useSelector } from "react-redux";
import DetailScreen from "./screens/DetailScreen";
import { SCREEN_ID } from "./CONST";
import { setDetail, setIsMock, setModalMessage, setSelectedScreen, setUserId, setUserName } from "./store/screenSlice";
import { authShare, login } from "./fs/songfs.ts";

export default function Main() {
  const selectedScreens = useSelector((state) => state.screen.selectedScreen);
  const selectedScreen = selectedScreens[selectedScreens.length - 1];
  const modalMessage = useSelector((state)=>state.screen.modalMessage);
  console.log(modalMessage)
  const dispatch = useDispatch()
  // useEffect(() => {
  //   window.scroll({
  //     top: 0,
  //   });
  // }, [selectedScreens]);
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const userHash = params.get("userHash");
    const isMock = params.get("isMock");
    if(userHash){
      localStorage.setItem("userHash",userHash)
    }
    if(isMock !== undefined){
      localStorage.setItem("isMock",isMock)
    }
    (async()=>{
      const {isLogin,userName,userId} = await login()
      if(isLogin){
        dispatch(setSelectedScreen(SCREEN_ID.HOME))
        dispatch(setUserId(userId))
        dispatch(setUserName(userName))
      }
    })(dispatch)
  },[])
  //共有セットリスト
  useEffect(async()=>{
    const params = new URLSearchParams(window.location.search);

    const setlistId = params.get("setlistId");
    const setlistKey = params.get("setlistKey");
    const res = await authShare(setlistId,setlistKey)
    if(res.data){
      dispatch(setSelectedScreen(SCREEN_ID.SETLIST_DETAIL))
      dispatch(setDetail(setlistId))
    }
  },[])
  return (
    <div>
      <Header />
      <div style={{ paddingTop: 60, paddingBottom: 60 }}>
        {modalMessage?.length !== 0 && <Modal text = {modalMessage}/>}
        {MainScreenBuilder(selectedScreen)}
      </div>
      <Footer />
    </div>
  );
}

function Modal({ text }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setModalMessage(""));
    }, 3000);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div
      style={styles.overlay}
      onClick={() => dispatch(setModalMessage(""))}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {text}
      </div>
    </div>
  );
}

function MainScreenBuilder(selectedScreen) {
  if (WITH_SIDE_SCREEN.includes(selectedScreen)) {
    return <WithSiteScreen />;
  } else {
    return <DetailScreen />;
  }
}

const WITH_SIDE_SCREEN = [
  SCREEN_ID.HOME,
  SCREEN_ID.HISTORY,
  SCREEN_ID.SETLIST,
  SCREEN_ID.SETLIST_DETAIL,
  SCREEN_ID.SONG_REGIST,
  SCREEN_ID.SETLIST_REGIST,
  SCREEN_ID.LOGIN,
  SCREEN_ID.SONG_UPDATE
];

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.3)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 9999,
  },

  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    minWidth: 300,
    maxWidth: "80%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    fontSize: 18,
    textAlign: "center",
  },
};