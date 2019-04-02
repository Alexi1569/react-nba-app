import React from 'react';
import '../../articles.css';

const PostBody = (props) => (
  <div className="article-body">
    <h1>{props.article.title}</h1>
    <div
      className="article-body-image"
      style={{
        background: `url(/images/articles/${props.article.image})`
      }}
    >
    </div>
    <div className="article-body-text">{props.article.body}</div>
  </div>
)

export default PostBody;