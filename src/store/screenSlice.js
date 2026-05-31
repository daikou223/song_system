import { createSlice } from "@reduxjs/toolkit";

const screenSlice = createSlice({
  name: "screen",

  initialState: {
    selectedScreen: [1],
    detailId:{},
    userId:1,
    userName:"",
    reloadCount:0,
    isMock:false
  },

  reducers: {
    setSelectedScreen(state, action) {
      state.selectedScreen.push(action.payload);
    },
    backSelectScreen(state){
      state.selectedScreen.pop();
    },
    setDetail(state,action){
      state.detailId[Number(state.selectedScreen[state.selectedScreen.length-1])] = action.payload;
    },
    setUserId(state,action){
      state.userId = action.payload;
    },
    setUserName(state,action){
      state.userName = action.payload;
    },
    setReloadCount(state){
      state.reloadCount += 1
    },
    setIsMock(state,action){
      state.isMock = action.payload;
    }
  },
});

export const { setSelectedScreen,backSelectScreen,setDetail,setUserId,setUserName,setReloadCount,setIsMock } = screenSlice.actions;

export default screenSlice.reducer;
