import axios from "axios";
import { HistoryClass } from "../class/History.ts";
import { SetListClass } from "../class/SetList.ts";
import { Song } from "../class/Song.ts";
import { useDispatch } from "react-redux";
import {
  setReloadCount,
  setSelectedScreen,
  setUserName,
} from "../store/screenSlice.js";
import { SCREEN_ID } from "../CONST.js";
const isMock = false;
export async function getSong(
  userId: string,
  keyWord?: string,
): Promise<Song[]> {
  const res = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/songs?isMock=${isMock}&keyword=${keyWord ?? ""}`,
  );
  const historyRes = await getHistory("new", userId);
  const songs = res.data;
  const responce = songs.map((song: any) => {
    const targetSong = historyRes.find((s) => s.id == song.id);
    return {
      ...song,
      sing_count: targetSong?.sing_count ?? 0,
      last_sung_at: targetSong?.last_sung_at ?? "履歴なし",
    };
  });

  return responce;
}

export async function getSongWithId(
  id: number,
  user_id: number,
): Promise<Song | undefined> {
  const res = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/song/${id}?isMock=${isMock}&userId=${user_id}`,
  );
  const songBaseData = res.data[0];
  const song: Song = new Song(
    songBaseData.song_id,
    songBaseData.title,
    songBaseData.artist,
  );
  song.setMusic(songBaseData.music_url);
  song.setRisics(songBaseData.lyrics_url);
  res.data.forEach((element) => {
    if (element.history_id) {
      song.addHistory(new HistoryClass(element.sung_at, element.memo));
    }
  });
  return song;
}

export async function getHistory(
  order: string,
  userId: string,
): Promise<Song[]> {
  const res = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/history?
isMock=${isMock}&
userId=${userId}&
order=${order}`,
  );
  const songs = res.data;
  return songs;
}

export async function getSetList(
  userId: number,
  onlySelf?: boolean,
): Promise<SetListClass[]> {
  const res = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/setLists?
isMock=${isMock}&
userId=${userId}&
onlySelf=${onlySelf}`,
  );

  const setLists: SetListClass[] = [];
  for (let i = 0; i < res.data.length; i++) {
    const targetSetList = setLists.find(
      (setList) => setList.id == res.data[i].setlist_id,
    );
    if (!targetSetList) {
      setLists.push(
        new SetListClass(
    res.data[i].setlist_id,
    res.data[i].setlist_title,
    res.data[i].share_key,
    res.data[i].user_id,
    res.data[i].user_name,
    res.data[i].user_id === userId,
      ));
      if (res.data[i].id) {
        setLists[setLists.length - 1].addSong(
          new Song(res.data[i].id, res.data[i].title, ""),
        );
      }
    } else {
      if (res.data[i].id) {
        targetSetList.addSong(new Song(res.data[i].id, res.data[i].title, ""));
      }
    }
  }
  return setLists;
}

export async function authShare(setListId: string, setListKey: string) {
  console.log(setListId, setListKey);
  const res = await axios.post(
    `https://daikou-diverse-api.com/data_20260405/authSetList?`,
    { setListId, setListKey },
  );
  return res;
}

export async function getSetListWithId(
  id: number,
  userId: number,
): Promise<SetListClass | undefined> {
  const res = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/setlist/${id}?
isMock=${isMock}&userId=${userId}`,
  );

  const is_saving = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/is_save?
setlistId=${id}&userId=${userId}`,
  );
  const setList: SetListClass = new SetListClass(
    res.data[0].setlist_id,
    res.data[0].setlist_title,
    res.data[0].share_key,
    res.data[0].user_id,
    res.data[0].user_name,
    is_saving.data || res.data[0].user_id === userId,
  );
  const historyRes = await getHistory("new", res.data[0].user_id);
  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].id) {
    const targetSong = historyRes.find((s) => s.id == res.data[i].id);
      setList.addSong(
        {id:res.data[i].id,
          title:res.data[i].title,
          artist:res.data[i].artist,
          last_sung_at:res.data[i].last_sung_at ?? "履歴なし",
        sing_count: targetSong?.sing_count ?? 0}
      );
    }
  }
  return setList;
}

export async function postSetListWithId(userId: number, setlistId: number) {
  const is_saving = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/is_save?
setlistId=${setlistId}&userId=${userId}`,
  );
  if (is_saving) {
    const result = await axios.post(
      `https://daikou-diverse-api.com/data_20260405/is_save`,
      { setlistId: setlistId, userId: userId },
    );
    return result;
  }
  return false;
}

export async function login() {
  const userHash = localStorage.getItem("userHash");
  const res = await axios.get(
    `https://daikou-diverse-api.com/data_20260405/login?
user_hash=${userHash}`,
  );
  localStorage.setItem("userHash", res.data.userHash);
  return {
    isLogin: true,
    userName: res.data.userName,
    userId: res.data.userId,
  };
}

export async function setUserNameAsync(newUserName: string, dispatch: any) {
  const userHash = localStorage.getItem("userHash");
  const res = await axios.post(
    `https://daikou-diverse-api.com/data_20260405/userName`,
    { userName: newUserName, userHash: userHash },
  );
  if (res.status == 200) {
    dispatch(setUserName(newUserName));
  } else {
    console.log("error");
  }
  dispatch(setSelectedScreen(SCREEN_ID.HOME));
}

export async function postSetList(datas: any, userId: string, dispatch: any) {
  const res = await axios.post(
    `https://daikou-diverse-api.com/data_20260405/setlist/?is_mock=${isMock}`,
    { title: datas?.setListName ?? "名無しのリスト", user_id: userId },
  );
  dispatch(setSelectedScreen(SCREEN_ID.SETLIST));
  return true;
}

export async function postSong(datas: any, dispatch: any) {
  const res = await axios.post(
    `https://daikou-diverse-api.com/data_20260405/song/?is_mock=${isMock}`,
    { title: datas?.songName, artist: datas?.artist },
  );
  dispatch(setSelectedScreen(SCREEN_ID.HOME));
  return true;
}

export async function postHistory(
  songId: number,
  date: string,
  memo: string,
  userId: string,
  dispatch: any,
) {
  const res = await axios.post(
    `https://daikou-diverse-api.com/data_20260405/history/?is_mock=${isMock}`,
    {
      sung_at: date,
      memo: memo,
      song_id: songId,
      user_id: userId,
    },
  );
  dispatch(setSelectedScreen(SCREEN_ID.HOME));
  return true;
}

export async function putSetList(song: any, setListState: any, dispatch: any) {
  const res = await axios.put(
    `https://daikou-diverse-api.com/data_20260405/setlist/${song.id}`,
    { setLists: setListState },
  );
  dispatch(setSelectedScreen(SCREEN_ID.HOME));
  dispatch(setReloadCount());
  return true;
}

function createRandom(): () => number {
  let value = seed;
  seed = (seed * 16807) % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}
