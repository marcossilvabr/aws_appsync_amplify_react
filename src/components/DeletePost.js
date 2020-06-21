import React, { Fragment } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { deletePost } from '../graphql/mutations';

const DeletePost = ({post}) => {

  const handleDeletePost = async (postID) => {
    const input = {
      id: postID
    }
    await API.graphql(graphqlOperation(deletePost, {input}));
  }

  return (
    <Fragment>
      <button
        onClick={() => handleDeletePost(post.id)}
      >
        Delete
      </button>
    </Fragment>
  )
}

export default DeletePost;