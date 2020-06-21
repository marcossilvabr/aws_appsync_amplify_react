import React, { Fragment, useEffect, useState } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { updatePost } from '../graphql/mutations';

const EditPost = ({ post }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [editPost, setEditPost] = useState({
    id: '',
    postOwnerId: post.postOwnerId,
    postOwnerUsername: post.postOwnerUsername,
    postTitle: post.postTitle,
    postBody: post.postBody,
  })

  useEffect(() => {
    Auth.currentUserInfo()
      .then(user => {
        setEditPost({
          ...editPost,
          postOwnerId: user.attributes.sub,
          postOwnerUsername: user.username,
        })
      })
  }, [])

  const handleOpenModal = () => {
    setShowEdit(!showEdit);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const handleUpdate = async (e) => {
    const {postOwnerId, postOwnerUsername, postTitle, postBody} = editPost;
    e.preventDefault();
    const input = {
      id: post.id,
      postOwnerId,
      postOwnerUsername,
      postTitle,
      postBody
    }
    await API.graphql(graphqlOperation(updatePost, {input}));
    setShowEdit(false);
  }

  const handleTitleChange = (e) => {
    e.preventDefault();
    setEditPost({
      ...editPost,
      postTitle: e.target.value,
    })
  }

  const handleBodyChange = (e) => {
    e.preventDefault();
    setEditPost({
      ...editPost,
      postBody: e.target.value,
    })
  }

  return (
    <Fragment>
      { showEdit && (
        <div className="modal">
          <button onClick={() => handleOpenModal()}>
            X
          </button>

          <form 
            className=""
            onSubmit={(e) => handleUpdate(e)}
          >
            <input 
              type="text" 
              placeholder="" 
              name="postTitle" 
              value={editPost.postTitle}
              onChange={(e) => handleTitleChange(e)} />

            <input 
              type="text"
              placeholder=""
              name="postBody"
              value={editPost.postBody}
              onChange={(e) => handleBodyChange(e)}
            />

            <button>Update Post</button>

          </form>
        </div>
      ) }
      <button 
        onClick={() => handleOpenModal()}
      >
        Edit
      </button>
    </Fragment>
  )
}

export default EditPost;