import './App.css';
import React from 'react';
import Adder from "../Adder/Adder";
import AlbumStack from "../AlbumStack/AlbumStack";

function App() {


  const [album_stack, setalbum_stack] = React.useState([])
  const [status, set_status] = React.useState('not_launched')

  return (
    <div className='App_pannel'>
      <Adder setalbum_stack={setalbum_stack} album_stack={album_stack}
             set_status={set_status} status={status}/>
      <AlbumStack setalbum_stack={setalbum_stack} album_stack={album_stack}
                  set_status={set_status} status={status}/>
    </div>
    
  );
}

export default App;
