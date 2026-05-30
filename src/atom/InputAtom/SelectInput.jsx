import InputTile from "./InputTitle";

export default function SelectInput({ item, datas, setDatas }) {
  return (
    <div style={{ display: "flex" }}>
      <InputTile item = {item}/>
      <select
        value={datas[item.key] || ""}
        onChange={(e) =>
          setDatas({
            ...datas,
            [item.key]: e.target.value,
          })
        }
        style = {{border:"none",borderBottom:"1px solid black",width:300}}
      >
        {item.selection.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
