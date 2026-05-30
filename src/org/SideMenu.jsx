import { useDispatch, useSelector } from "react-redux";
import { setSelectedScreen } from "../store/screenSlice";
import { SCREEN_ID } from "../CONST";

export default function SideMenu({ isBottom = false }) {
  const dispatch = useDispatch();

  const selectedScreens = useSelector(
    (state) => state.screen.selectedScreen
  );

  const selectedScreen =
    selectedScreens[selectedScreens.length - 1];

  return (
    <div
      style={
        isBottom
          ? styles.bottomMenuWrapper
          : styles.sideMenuWrapper
      }
    >
      <div
        style={
          selectedScreen === SCREEN_ID.HOME
            ? styles.selectedMenu
            : styles.menu
        }
        onClick={() =>
          dispatch(setSelectedScreen(SCREEN_ID.HOME))
        }
      >
        ホーム
      </div>

      <div
        style={
          selectedScreen === SCREEN_ID.HISTORY
            ? styles.selectedMenu
            : styles.menu
        }
        onClick={() =>
          dispatch(setSelectedScreen(SCREEN_ID.HISTORY))
        }
      >
        履歴
      </div>

      <div
        style={
          [
            SCREEN_ID.SETLIST,
            SCREEN_ID.SETLIST_DETAIL,
          ].includes(selectedScreen)
            ? styles.selectedMenu
            : styles.menu
        }
        onClick={() =>
          dispatch(setSelectedScreen(SCREEN_ID.SETLIST))
        }
      >
        セトリ
      </div>
    </div>
  );
}

const styles = {
  sideMenuWrapper: {
    backgroundColor: "#CCCCCC",
    height: "100%",
    width: 200,
    position: "fixed",
    left: 0,
  },

  bottomMenuWrapper: {
    backgroundColor: "#CCCCCC",
    width: "100%",
    height: 60,
    position: "fixed",
    bottom: 0,
    left: 0,
    display: "flex",
  },

  menu: {
    border: "1px solid gray",
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    textAlign: "center",
    paddingTop: 20,
    fontSize: 18,
    flex: 1,
  },

  selectedMenu: {
    border: "1px solid gray",
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    textAlign: "center",
    paddingTop: 20,
    fontSize: 18,
    backgroundColor: "#ffCC99",
    flex: 1,
  },
};