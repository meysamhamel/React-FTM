import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';
import './Notes.css';

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: null,
    };
  }

  render() {
    return (
      <div className="container">
        <div className="cardPlacement">
          {
            this.props.notes.map((note, index) => {
              return <Card className="note-card" key={index}> <CardContent><h3>Note:</h3> {note} </CardContent></Card>;
            })
          }
        </div>
      </div>
    );
  }
}

export default Notes;
