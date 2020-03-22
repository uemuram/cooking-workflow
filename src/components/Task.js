import React from 'react';
import '../_css/Cooking.css';

class Task extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Task">
        {this.props.action.title}
      </div>
    );
  }
}

export default Task;
