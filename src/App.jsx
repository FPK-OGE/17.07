import VersionedTimer from "./SimpleTimer";







const App = () => {
  return <>
<VersionedTimer 
  version="1.4" 
  initialTime={625425} 
  direction="down"
  finishImageUrl="https://example.com/photo.jpg"
/>

  </> 
}




export default App;