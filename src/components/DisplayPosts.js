import React, { Fragment, useState, useEffect } from 'react';
import { listPosts } from '../graphql/queries';
import { onCreatePost, onDeletePost } from '../graphql/subscriptions';
import { API, graphqlOperation } from 'aws-amplify';
import DeletePost from './DeletePost';
import EditPost from './EditPost';

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const db_posts = await API.graphql(graphqlOperation(listPosts));
    return setPosts(db_posts.data.listPosts.items);
  }

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const createPostListener =
      API.graphql(graphqlOperation(onCreatePost))
        .subscribe({
          next: postData => {
            const newPost = postData.value.data.onCreatePost;
            const prevPosts = posts.filter(post => post.id !== newPost.id);
            const updatedPosts = [newPost, ...prevPosts];
            setPosts(updatedPosts);
          }
        })
    const deletePostListener =
      API.graphql(graphqlOperation(onDeletePost))
        .subscribe({
          next: postData => {
            const deletedPost = postData.value.data.onDeletePost;
            const updatedPosts = posts.filter(post => post.id !== deletedPost.id);
            setPosts(updatedPosts);
          }
        })
    return () => {
      createPostListener.unsubscribe();
      deletePostListener.unsubscribe();
    }
  }, [posts]);

  return (
    <Fragment>
      {posts.map((post) => (
        <div 
          className="posts"
          style={{ backgroud: '#f4f4f4', padding: '10px', border: '1px #ccc dotted', margin: '14px' }}
          key={post.id}
        >
          <h1>{post.postTitle}</h1>
          <p style={{ fontStyle: 'italic', color: 'blue' }}>Wrote by: {post.postOwnerUsername}</p>
          <time style={{ fontStyle: 'italic' }}>
            <p>{ new Date(post.createdAt).toDateString() }</p>
          </time>
          <p>{post.postBody}</p>

          <br />
          <span>
            <DeletePost post={post} />
            <EditPost />
          </span>
        </div>
      ))}
    </Fragment>
  )
}

export default DisplayPosts;