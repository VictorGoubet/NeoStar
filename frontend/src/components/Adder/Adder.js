import './Adder.css';
import React from 'react';


class Adder extends React.Component {

  state = {
    name:"",
    author:"",
    link:"",
    downloaded:"no"
  }

  add_album = (event) =>{
    event.preventDefault();
    if(this.state.link !== "" && this.state.author !== "" && this.state.name !== ""){
      this.props.setalbum_stack([...this.props.album_stack, {...this.state}])
      this.setState({name:"", author:"", link:""})
    }
    
  }

  handleChange = (event)=>{
    const change = {"name": x => this.setState({name:x}),
                    "author": x => this.setState({author:x}),
                    "link": x => this.setState({link:x}),
                    }
    change[event.target.className.split(" ")[0]](event.target.value)              
  }

  render(){
    return (
      
      <form className="Adder" onSubmit={this.add_album}>

      <div className="form-group">
        <label htmlFor="AlbumName">Name</label>
        <input type="text" id="AlbumName" placeholder="Album name" value={this.state.name} onChange={this.handleChange} className='name form-control'/>
      </div>
  
      <div className="form-group">
        <label htmlFor="Author">Author</label>
        <input type="text" id="Author" placeholder="Author" value={this.state.author} onChange={this.handleChange} className='author form-control'/>
      </div>
    
      <div className="form-group">
        <label htmlFor="inputAddress">Link</label>
        <input type="text" id="Link" placeholder="Link" value={this.state.link} onChange={this.handleChange} className='link form-control'/>
      </div>
      
      {["now", "succeed", "fail"].some(y => this.props.album_stack.map(x=>x.downloaded).includes(y))?(
        <button type="submit" className="btn btn-primary add_alb" disabled>Add</button>
      ):(
        <button type="submit" className="btn btn-primary add_alb">Add</button>
      )
    }
      
    </form>
    )
  };
}




export default Adder;
