export default function Footer() {
  const isMobile = window.innerWidth < 768;
  if(isMobile){return(<div></div>)}
  return (
    <div style={styles.footerWrapper}>
      <div style = {styles.footerText}>
        created by @だいこう-ユニコーン
      </div>
    </div>
  );
}

const styles = {
  footerWrapper: {
    width: "100%",
    height: 60,
    backgroundColor: "#cccccc",
    margin: 0,
    display: "flex",
    border: "1px solid black",
    position: "fixed",
    bottom: 0,
    zIndex:1000
  },
  footerText:{
    marginLeft:"auto",
    display:"flex",
    paddingTop:30,
    paddingRight:10
  }
};
