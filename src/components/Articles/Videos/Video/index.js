import React from 'react';
import {firebaseDB, firebaseTeams, firebaseVideos, firebaseLooper} from '../../../../firebase';
import VideoHeader from './videoHeader';
import VideosRelated from '../../../widgets/VideosList/VideosRelated/videosRelated';

import '../../articles.css';

class VideoArticle extends React.Component {
  state = {
    article: [],
    team: [],
    teams: [],
    related: [],
  }

  componentWillMount() {
    firebaseDB.ref(`/videos/${this.props.match.params.id}`).once('value')
      .then(snapshot => {
        const article = snapshot.val();

        firebaseTeams.orderByChild('teamId').equalTo(article.team).once('value')
          .then(snapshot => {
            const team = firebaseLooper(snapshot);
            this.setState({
              article,
              team,
            });

            this.getRelated();
          });
      })
  }

  getRelated = () => {
    firebaseTeams.once('value')
      .then(snapshot => {
        const teams = firebaseLooper(snapshot);

        firebaseVideos.orderByChild('team').limitToFirst(3).equalTo(this.state.article.team).once('value')
          .then(snapshot => {
            const related = firebaseLooper(snapshot);
            
            this.setState({
              related,
              teams,
            })
          });
      })
  }

  render() {
    const {article, team} = this.state;
    return (
      <div>
        <VideoHeader teamData={team[0]} />
        <div className="video-wrapper">
          <h1>{article.title}</h1>
          <iframe
            title="video-player"
            width="100%"
            height="300px"
            src={`https://www.youtube.com/embed/${article.url}`}
          >
          
          </iframe>
        </div>
        <VideosRelated 
          data={this.state.related}
          teams={this.state.teams}
        />
      </div>
    );
  }
}

export default VideoArticle;