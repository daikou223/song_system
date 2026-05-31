import { useSelector } from "react-redux"
import SideMenu from "../org/SideMenu"
import Home from "../org/mainPage/HomeScreen"
import History from "../org/mainPage/History"
import SetList from "../org/mainPage/SetList"
import { SCREEN_ID } from "../CONST"
import SetListDetail from "../org/mainPage/SetListDetail"
import RegistScreen from "../org/mainPage/RegistScreen"
import LoginScreen from "../org/mainPage/LoginScreen"

export default function WithSiteScreen() {
  const selectedScreens = useSelector(
    (state) => state.screen.selectedScreen
  );

  const selectedScreen =
    selectedScreens[selectedScreens.length - 1];

  const isMobile = window.innerWidth < 1000;

return (
  <div style={styles.sidemenuWrapper}>
    {!isMobile && <SideMenu />}

    <div
      style={{
        ...styles.main,
        paddingLeft: isMobile ? 0 : 200,
        paddingBottom: isMobile ? 60 : 0,
      }}
    >
      {mainScreenBuilder(selectedScreen)}
    </div>

    {isMobile && <SideMenu isBottom />}
  </div>
);
}

function BottomMenu() {
  return (
    <div style={styles.bottomMenu}>
      <button>ホーム</button>
      <button>履歴</button>
      <button>リスト</button>
      <button>設定</button>
    </div>
  );
}

function mainScreenBuilder(selectedScreen){
  switch(selectedScreen){
    case SCREEN_ID.HOME:
      return(
        <Home/>
      )
    case SCREEN_ID.HISTORY:
      return(
        <History/>
      )
    case SCREEN_ID.SETLIST:
      return(
        <SetList/>
      )
    case SCREEN_ID.SETLIST_DETAIL:
      return(
        <SetListDetail/>
      )
    case SCREEN_ID.SONG_REGIST:
    case SCREEN_ID.SETLIST_REGIST:
    case SCREEN_ID.SONG_UPDATE:
      return(
        <RegistScreen/>
      )
    case SCREEN_ID.LOGIN:
      return(<LoginScreen/>)
    default:
      return(
        <div>
          404 notFound
        </div>
      )
  }
}

const styles = {
  sidemenuWrapper:{
    display:"flex",
    height:"100vh",
    width:"100%",
    height:"100%"
  },
   wrapper: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
  },

  main: {
    width: "100%",
  },

  mobileHeader: {
    height: 50,
    display: "flex",
    alignItems: "center",
    paddingLeft: 16,
    borderBottom: "1px solid #ccc",
    fontSize: 24,
  },
}