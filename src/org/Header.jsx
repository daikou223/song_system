import { useDispatch, useSelector } from "react-redux";
import { setSelectedScreen } from "../store/screenSlice";
import { SCREEN_ID } from "../CONST";

const isMobile = window.innerWidth < 1000;

export default function Header(){
  return(
    <div style = {styles.headerWrapper}>
      <Title/>
      <LoginButton/>
    </div>
  )
}

function Title(){
  return(
    <div style = {styles.titleWrapper}>
      <div>歌枠支援システム</div>
      {isMobile && <div style = {{fontSize:10,marginLeft:20}}>created by @だいこう-ユニコーン</div>}
    </div>
  )
}

function LoginButton() {
  const dispatch = useDispatch();
  const screenSelector = useSelector((state)=>state.screen.screenSelector)
  const userName = useSelector((state)=>state.screen.userName)
  return (
    <div style={styles.loginWrapper}>
      <div
        style={styles.loginButton}
        onClick={()=>dispatch(setSelectedScreen(SCREEN_ID.LOGIN))}
      >
        {isMobile ? `${userName} さん`:`ようこそ ${userName} さん`}
        {screenSelector}
      </div>
    </div>
  );
}

const styles = {
  loginButton: {
    height: 40,
    width: "100%",
    textAlign: "right",
    paddingTop:10
  },
  loginWrapper: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    paddingRight: 20,
  },
  titleWrapper:{
    margin:10,
    fontSize:isMobile ? 20:30
  },
  headerWrapper:{
    width:"100%",
    height:60,
    backgroundColor:"#cccccc",
    margin:0,
    display:"flex",
    border:"1px solid black",
    position:"fixed",
    top:0,
    zIndex:1000
  }
}