import VersionedTimer from "./SimpleTimer";







const App = () => {
  return <>
<VersionedTimer 
  version="1.2" 
  initialTime={500} 
  direction="down"
  finishImageUrl="https://example.com/photo.jpg"
/>

  </> 
}




export default App;