import './App.css';
import React from 'react';
import Adder from "../Adder/Adder";
import AlbumStack from "../AlbumStack/AlbumStack";

function App() {


  const [album_stack, setalbum_stack] = React.useState([])

  return (
    <div className='App_pannel'>
      <Adder setalbum_stack={setalbum_stack} album_stack={album_stack}/>
      <AlbumStack setalbum_stack={setalbum_stack} album_stack={album_stack}/>
    </div>
    
  );
}

export default App;
