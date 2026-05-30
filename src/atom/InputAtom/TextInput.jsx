import InputTile from "./InputTitle";

export default function TextInput({ item, datas, setDatas }) {
  return (
    <div style={{ display: "flex" }}>
      <InputTile item = {item}/>
      <input
        type="text"
        value={datas[item.key]}
        onChange={(e) => {
          setDatas((prev) => {
            return { ...prev, [item.key]: e.target.value };
          });
        }}
        style = {{border:"none",borderBottom:"1px solid black",width:"40%"}}
        placeholder= {item.title}
      />
    </div>
  );
}
