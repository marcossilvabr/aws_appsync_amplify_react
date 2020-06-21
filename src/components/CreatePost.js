import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createPost } from '../graphql/mutations';

const CreatePost = () => {
  const [newPost, setNewPost] = useState({
    postOwnerId: '',
    postOwnerUsername: '',
    postTitle: '',
    postBody: ''
  })

  useEffect(() => {
    const getUserInfo = async () => await Auth.currentUserInfo()
      .then(user => {
        setNewPost({...newPost, postOwnerId: user.attributes.sub, postOwnerUsername: user.username});
      })
    getUserInfo();
  }, [])

  const handleChangePost = (e) => {
    e.preventDefault();
    setNewPost({ ...newPost, [ e.target.name ]: e.target.value })
  }

  const handleAddPost = async (e) => {
    const { postOwnerId, postOwnerUsername, postTitle, postBody } = newPost;
    e.preventDefault();
    const input = { 
      postOwnerId,
      postOwnerUsername,
      postTitle,
      postBody,
      createdAt: new Date().toISOString() 
    };
    await API.graphql(graphqlOperation(createPost, { input }));
    setNewPost({
      postOwnerId: '',
      postOwnerUsername: '',
      postTitle: '',
      postBody: ''
    })
  }

  const {
    postTitle,
    postBody,
  } = newPost;

  return (
    <form className="add-post" onSubmit={(e) => handleAddPost(e)}>
      <input 
        style={{ font: '19px' }}
        type="text"
        placeholder="Title"
        name="postTitle"
        required
        value={postTitle}
        onChange={(e) => handleChangePost(e)}
      />
      <textarea 
        type="text"
        name="postBody"
        rows="3"
        cols="40"
        required
        placeholder="New Blog Post"
        value={postBody}
        onChange={(e) => handleChangePost(e)}
      />
      <input 
        className="btn"
        type="submit"
        style={{ fontSize: '19px' }}
      />
    </form>
  )
}

export default CreatePost;