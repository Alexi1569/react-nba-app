import React from 'react';
import '../../articles.css';

const PostBody = props => (
  <div className='article-body'>
    <h1>{props.article.title}</h1>
    <div
      className='article-body-image'
      style={{
        background: `url(${props.image})`
      }}
    />
    <div
      dangerouslySetInnerHTML={{
        __html: props.article.body
      }}
      className='article-body-text'
    />
  </div>
);

export default PostBody;
