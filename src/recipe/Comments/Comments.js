import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';
import './Comments.css';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null,
    };
  }

  render() {
    let comments = [...this.props.comments];
    if(!comments.length) {
      comments.push('No Comments')
    }
    return (
      <div className="comment-container">
        <h1 className="comments-title">Comments</h1>
        <div className="comment-card-placement">
          {
            comments.map((comment, index) => {
              return <Card className="comment-card" key={index}> <CardContent>{comment}</CardContent></Card>;
            })
          }
        </div>
      </div>
    );
  }
}

export default Comments;
