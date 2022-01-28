import './AlbumStack.css';
import React from 'react';


function AlbumStack({setalbum_stack, album_stack}) {

  const del_album = event => {
    event.preventDefault();
    setalbum_stack(album_stack.filter(x=> x.link !== event.target.id))
  }


  const reset_stack = () =>{
    setalbum_stack([])
  }


  const get_dl = () =>{
    reset_stack()
  }

  const launch_dl = event =>{
    event.preventDefault();

    if(album_stack.length > 0){
      let copy_as = [...album_stack]

      copy_as.forEach(x=>x.downloaded="now")
      setalbum_stack(copy_as)
      const promise = new Promise((resolve, _) => {
        copy_as.forEach(x=>{x.link = encodeURIComponent(x.link)})
        let url
        if(process.env.NODE_ENV === "development"){
          url = "http://localhost:5000"
        }
        else{
          url = "https://NeoStar.herokuapp.com"
        }
        const data =  window.fetch(encodeURI(`${url}/download/${JSON.stringify(copy_as)}`));
        resolve(data);
      });

      promise.then(res=>{
        res.json().then(res =>{
          let update_as = [...album_stack]
          
          for (let link in res){
            update_as.forEach(x => {
              if(x.link === link){
                x.downloaded = res[link]
              }
            })
          }
          setalbum_stack(update_as)
        })
      })
      
    }
    
  }

  return (
      <form className="AlbumStack" onSubmit={launch_dl}>
        <ul className="list-group stack">

        {album_stack.map((x, i)=>(

          <li className="list-group-item  list-group-item-action" key={i}>
            {x.name} - {x.author}


            {x.downloaded === "no" ?(
              <button type="button" className="btn btn-secondary delbtn" onClick={del_album} id={x.link}>X</button>
           ): x.downloaded === "now" ?(
            <div className="spinner-border delbtn" role="status"/>
           ):x.downloaded === "succeed"?(
            <button type="button" className="btn btn-success delbtn" disabled>OK</button>
           ):(
            <button type="button" className="btn btn-danger delbtn" disabled>FAIL</button>
           )}
            
          </li>
        ))}
        </ul>

        
        {album_stack.length > 0? (
          
          album_stack.map(x=>x.downloaded).includes("now") ?(
          <div>
            <button type="submit" className="btn btn-primary" disabled>GO</button>
            <button type="button" className="btn btn-primary rst" disabled>Reset</button>
          </div>

          
        ):(
          album_stack.map(x=>x.downloaded).includes("no")?(
            <div>
            <button type="submit" className="btn btn-primary">GO</button>
            <button type="button" className="btn btn-primary rst" onClick={reset_stack}>Reset</button>
          </div>
          ):(
            <div>
              <button type="button" className="btn btn-primary" onClick={get_dl}>Download</button>  
              <button type="button" className="btn btn-primary rst" onClick={reset_stack}>Reset</button>
            </div>
              
          )
          
        )):(
          <div></div>
        )
      }
        
      </form>

    
  );
}

export default AlbumStack;
