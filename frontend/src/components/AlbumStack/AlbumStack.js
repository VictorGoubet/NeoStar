import './AlbumStack.css';
import React from 'react';
import { saveAs } from "file-saver";
import io from "socket.io-client";

class AlbumStack extends React.Component {

  state = {
    socket:null,
    id : '',
    root:process.env.NODE_ENV === "development"?"http://localhost:5000":"https://neostar.herokuapp.com:5000"
  }

  del_album = event => {
    event.preventDefault();
    this.props.setalbum_stack(this.props.album_stack.filter(x=> x.link !== event.target.id))
  }


  reset_stack = () =>{
    this.props.setalbum_stack([])
    this.props.set_status('not_launched')
    window.fetch(`${this.state.root}/reset/${this.state.id}`)
    
    
  }


  get_dl = event => {
    event.preventDefault();
    saveAs(`${this.state.root}/send_album/${this.state.id}`, `Albums.zip`)
    this.reset_stack()
  };

  launch_dl = event =>{
    event.preventDefault();
    

    if(this.props.album_stack.length > 0){
      let prom = new Promise(resolve=>{
        let s = io(this.state.root)
        resolve(s)
      })
      
      prom.then(x=>{
        this.setState({socket:x})
        let copy_as = [...this.props.album_stack]
        copy_as.forEach(x=>x.downloaded="now")
        this.props.set_status('processing')
        this.props.setalbum_stack(copy_as)
        this.state.socket.emit("download", JSON.stringify(copy_as))

      })
      
    }
  }


  componentDidUpdate = () => {
    if(this.state.socket != null){
      this.state.socket.on("response_download", (res) => {
  
        let update_as = [...this.props.album_stack]
          this.setState({'id':res.id})
          let st = 'all_fail'
          for (let link in res.data){
  
            if (st === 'all_fail' && res.data[link] === 'succeed'){
              st = 'succeed'
            }
  
            update_as.forEach(x => {
              if(x.link === link){
                x.downloaded = res.data[link]
              }
            })
          }
          this.props.set_status(st)
          this.props.setalbum_stack(update_as)
          this.state.socket.disconnect()
      })

    }
    
  }

  render(){
    return (
        <form className="AlbumStack" onSubmit={this.launch_dl}>
          <ul className="list-group stack">

          {this.props.album_stack.map((x, i)=>(

            <li className="list-group-item  list-group-item-action" key={i}>
              {x.name} - {x.author}


              {x.downloaded === "no" ?(
                <button type="button" className="btn btn-secondary delbtn" onClick={this.del_album} id={x.link}>X</button>
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

          
          {this.props.album_stack.length > 0? (
            
            this.props.status === "processing"?(
            <div>
              <button type="submit" className="btn btn-primary" disabled>GO</button>
              <button type="button" className="btn btn-primary rst" disabled>Reset</button>
            </div>

            
          ):(
            this.props.status === "not_launched"?(
              <div>
              <button type="submit" className="btn btn-primary">GO</button>
              <button type="button" className="btn btn-primary rst" onClick={this.reset_stack}>Reset</button>
            </div>
            ):this.props.status === "succeed"?(

              <div>
                <button type="button" className="btn btn-primary" onClick={this.get_dl}>Download</button>  
                <button type="button" className="btn btn-primary rst" onClick={this.reset_stack}>Reset</button>
              </div>
                
            ):(
              <button type="button" className="btn btn-primary rst" onClick={this.reset_stack}>Reset</button>
            )
            
          )):(
            <div></div>
          )
        }
          
        </form>

      
    );
  }
}

export default AlbumStack;
