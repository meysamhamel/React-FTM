import React, { Component } from 'react';
import { withApollo, Mutation, compose } from 'react-apollo';
import Icon from '@material-ui/core/Icon';
import { Add, Check } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import gql from 'graphql-tag';
import './ProfilePicture.css';
import withLocalData from '../../withLocalData';

class ProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: null,
      name: null,
      hover: false,
      viewingMyProfile: this.props.viewingMyProfile,
    };

    this.uploadFile = this.uploadFile.bind(this);
    this.hoverEnter = this.hoverEnter.bind(this);
    this.hoverLeave = this.hoverLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.btnRef = React.createRef();
  }

  hoverEnter() {
    this.setState({ hover: true });
  }
  hoverLeave() {
    this.setState({ hover: false });
  }
  handleClick(e) {
    console.log('clicked profile picture');
    if (this.props.viewingMyProfile) {
      const node = this.btnRef.current;
      node.click();
    }
  }

  uploadFile = async photos => {
    const { client, userId } = this.props;
    const data = {
      image: photos
    };
    const u_id = userId;
    console.log('new profile photo ', data.image);
    console.log('u_id: ', u_id);
    client
      .mutate({
        mutation: gql`
          mutation UpdateUser(
            $userId: String!
            $userUpdates: UpdateUserInput!
          ) {
            updateUser(userId: $userId, userUpdates: $userUpdates) {
              id
              profilePicture
            }
          }
        `,
        variables: {
          userUpdates: {
            profilePicture: data.image[0]
          },
          userId: u_id
        }
      })
      .then(result => {
        console.log('uploaded photo: ', result.data);
        this.setState({ imageURL: result.data.updateUser.profilePicture });
        window.location.reload();
      })
      .catch(err => {
        console.log('failed to upload photo, err: ');
        console.log(err);
      });
  };

  UPLOAD_FILE = gql`
    mutation UploadPhoto($file: Upload!) {
      uploadPhoto(file: $file)
    }
  `;

  render() {
    return (
      <div className="fullSize user-info">
        <div className="container">
          <div className={this.state.viewingMyProfile ? 'pic-container pic-overlay pic-cursor' : 'pic-container'}>
            {this.state.viewingMyProfile ? (
              <React.Fragment>
                <img
                  alt="user"
                  title="Edit Profile Picture"
                  src={
                    this.props.imageURL !== null
                      ? this.props.imageURL
                      : 'http://i65.tinypic.com/2rnvc7k.png'
                  }
                  className="profile-pic pic-cursor"
                  onMouseEnter={this.hoverEnter}
                  onMouseLeave={this.hoverLeave}
                  onClick={this.handleClick}
                />
                <div className="overlay" />
                <Mutation mutation={this.UPLOAD_FILE}>
                  {uploadFile => (
                    <input
                      type="file"
                      id="file-uploader"
                      accept="image/jpg, image/jpeg, image/png"
                      ref={this.btnRef}
                      className="upload-pic"
                      style={{ display: 'none' }}
                      required
                      onChange={({ target: { validity, files } }) => {
                        validity.valid && this.uploadFile(files);
                      }}
                    />
                  )}
                </Mutation>
              </React.Fragment>
            ) : (
              <img
                alt="user"
                title="Edit Profile Picture"
                src={
                  this.props.imageURL !== null
                    ? this.props.imageURL
                    : 'http://i65.tinypic.com/2rnvc7k.png'
                }
                className="profile-pic"
              />
            )}

            {this.state.hover && this.state.viewingMyProfile && (
              <Icon
                className="edit-profile-pic"
                title="Edit Profile Picture"
                onMouseEnter={this.hoverEnter}
                onMouseLeave={this.hoverLeave}
                onClick={this.handleClick}
              >
                edit
              </Icon>
            )}
            
          </div>
        </div>
        <div className="upload-profile" />

        <div className="info">
          <div className="username">
            <span>{this.props.name}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withLocalData,
  withApollo
)(ProfilePicture);
