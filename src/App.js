import React, { Component } from 'react';
import './App.css';

import { InputGroup, InputGroupAddon, Button, Input, Label } from 'reactstrap';
import {Table} from 'reactstrap';
import {Container, Row, Col} from 'reactstrap';
import {UncontrolledAlert} from 'reactstrap';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      alert : null,
      loading : null,
      list : null,
      start : null,
      end : null,
      nb : 20
    }

    this.handleInputChange = this.handleInputChange.bind(this);

  }

  AlertMessage(alertMessage, status = 'danger'){
    return(<UncontrolledAlert color={status} toggle = {()=> this.setState({alert:null})}>{alertMessage}</UncontrolledAlert>)
  }


   updateInformation (){
     if(this.state.start === null || this.state.end ===null )
     {
       this.setState({alert:"Vous n\' avez pas remplis les champs de dates."})
       return;
     }
     console.log('start : ' + this.state.start)
     console.log('end : ' + this.state.end)
     this.setState({loading:"loading...", alert:null, list:null})
    fetch("http://vps528307.ovh.net/TicketsList?random="+Math.random(), {
      method : 'POST',
      body :JSON.stringify({
        start: this.state.start,
          end: this.state.end
        }),
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
    })
      .then(res => res.json())
      .then(
        (result) => {
          let data = [].concat.apply([], result)
          let toSend = []
          let i =0;

          for(i=0; i<this.state.nb; i++){
            let toAdd = data[Math.floor(Math.random()*data.length)]
            toAdd in toSend ? i-- : toSend.push(toAdd);
          }

          console.log(JSON.stringify(toSend))
          this.setState({loading:null, list:toSend})

        },

        (error) => {
            console.log(error)
        }
      )

  }

  handleInputChange(event){
    const target = event.target;
    const value  = target.value;
    const name = target.name;
    console.log(name)

    this.setState({
      [name]:value
    })
  }
  render() {
    let toSend = []
    if(this.state.list != undefined){
      for(let i=0; i<this.state.nb; i++){
        if(this.state.list[i]){
          toSend.push(<tr>
            <td>{this.state.list[i].lastname}</td>
            <td>{this.state.list[i].firstname}</td>
          </tr>)
        }
      }
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Générateur de goodies</h1>
          {this.state.alert !== null ? this.AlertMessage(this.state.alert) : ""}
        </header>
        <div>
      <InputGroup size="sm" className = "input-Group">
       <InputGroupAddon addonType="prepend">
         <Button>Date de début</Button>
       </InputGroupAddon>
       <Input
         name = 'start'
         value = {this.state.start}
         type='date'
         placeholder='aaaa-mm-ddThh:mm:00.000'
         onChange={this.handleInputChange}
         />
     </InputGroup>

     <InputGroup  size="sm" className = "input-Group">
      <InputGroupAddon addonType="prepend">
        <Button>Date de fin</Button>
      </InputGroupAddon>
      <Input
        name = 'end'
        value = {this.state.end}
        type='date'
        placeholder='aaaa-mm-ddThh:mm:00.000'
        onChange={this.handleInputChange}
        />

    </InputGroup>
    <InputGroup  size="sm" className = "input-Group">
     <InputGroupAddon addonType="prepend">
       <Button>Nombre de personnes</Button>
     </InputGroupAddon>
     <Input
       name = 'nb'
       value = {this.state.nb}
       type='number'
       onChange={this.handleInputChange}
       />

   </InputGroup>

    <br></br>

    <Button
      color="success"
      onClick = {() => this.updateInformation()}
      >rechercher</Button>
    <br/>
    <br/>
    <Container>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <Table>
             <thead>
               <tr>
                 <th>Last Name</th>
                 <th>First Name</th>
               </tr>
             </thead>
             <tbody>
                   {toSend}
             </tbody>
           </Table>
        </Col>
      </Row>
    </Container>
    {this.state.loading}
        </div>
      </div>
    );
  }
}

export default App;
