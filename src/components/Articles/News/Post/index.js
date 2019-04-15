import React from 'react';
import {
  firebase,
  firebaseDB,
  firebaseLooper,
  firebaseTeams
} from '../../../../firebase';

import PostHeader from './postHeader';
import PostBody from './postBody';

import '../../articles.css';

class NewsArticles extends React.Component {
  state = {
    article: [],
    team: [],
    imageURL: ''
  };

  componentWillMount() {
    firebaseDB
      .ref(`articles/${this.props.match.params.id}`)
      .once('value')
      .then(snapshot => {
        const article = snapshot.val();

        firebaseTeams
          .orderByChild('teamId')
          .equalTo(article.team)
          .once('value')
          .then(snapshot => {
            const team = firebaseLooper(snapshot);
            this.setState({
              team,
              article
            });

            this.getImageURL(article.image);
          });
      });
  }

  getImageURL = filename => {
    console.log(filename);
    firebase
      .storage()
      .ref('images')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({
          imageURL: url
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { article, team } = this.state;

    return (
      <div className='article-wrapper'>
        <PostHeader
          teamData={team[0]}
          date={article.date}
          author={article.author}
        />
        <PostBody image={this.state.imageURL} article={this.state.article} />
      </div>
    );
  }
}

export default NewsArticles;
