import React from 'react';
import './App.css';

class App2 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      aaa: "abcdeffg",
    }
//    alert("aaa: " + process.env.REACT_APP_BACKEND_URL  + " :bbb");

//    fetch("http://localhost:5001/api/courses")
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/courses")
    .then(response => response.json())
//      .then(json =>  alert(json[1].name));
      .then(json =>  this.setState( {aaa : json[0].name}));
    }

  render() {
    return (
      <p>
      test4 : {this.state.aaa}
    </p>
    )
  }
}

//function App2() {
//  return (
//    <p>
//      test
//    </p>
//  );
//}

export default App2;
