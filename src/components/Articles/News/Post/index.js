import React from 'react';
import {firebaseDB, firebaseLooper, firebaseTeams} from '../../../../firebase';

import PostHeader from './postHeader';
import PostBody from './postBody';

import '../../articles.css';

class NewsArticles extends React.Component {
  state = {
    article: [],
    team: [],
  }

  componentWillMount() {
    firebaseDB.ref(`articles/${this.props.match.params.id}`).once('value')
      .then(snapshot => {
        const article = snapshot.val();

        firebaseTeams.orderByChild('teamId').equalTo(article.team).once('value')
          .then(snapshot => {
            const team = firebaseLooper(snapshot);
            this.setState({
              team,
              article,
            });
          });
      })
  }

  render() {
    const {article, team} = this.state;

    return (
      <div className="article-wrapper">
        <PostHeader 
          teamData={team[0]}
          date={article.date}
          author={article.author}
        />
        <PostBody 
          article={this.state.article}
        />
      </div>
    );
  }
}

export default NewsArticles;