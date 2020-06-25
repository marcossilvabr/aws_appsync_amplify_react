import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createComment } from '../graphql/mutations';

const CreateCommentPost = ({ post }) => {
  const [comment, setComment] = useState({
    commentOwnerId: '',
    commentOwnerUsername: '',
  });
  const [content, setContent] = useState('');

  useEffect(() => {
    const getComment = async () => await Auth.currentUserInfo()
      .then(user => {
        setComment({
          commentOwnerId: user.attributes.sub,
          commentOwnerUsername: user.username,
        })
      })
    getComment();
  }, [])

  const handleChangeContent = (e) => {
    e.preventDefault();
    setContent(e.target.value);
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    const input = {
      commentPostId: post.id,
      commentOwnerId: comment.commentOwnerId,
      commentOwnerUsername: comment.commentOwnerUsername,
      content,
      createdAt: new Date().toISOString(),
    }
    await API.graphql(graphqlOperation(createComment, { input }))
    setComment({
      commentOwnerId: '',
      commentOwnerUsername: '',
    })
  }

  return (
    <div>
      <form className="add-comment" onSubmit={(e) => handleAddComment(e)}>
        <textarea 
          type="text"
          name="content"
          rows="3"
          cols="40"
          required
          placeholder="Add Your Comment"
          value={content}
          onChange={(e) => handleChangeContent(e)}
        />
        <input 
          className="btn"
          value="Add Comment"
          type="submit"
        />
      </form>
    </div>
  )
}

export default CreateCommentPost;