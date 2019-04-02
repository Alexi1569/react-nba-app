import React from 'react';
import Button from '../Buttons/buttons';
import VideosTemplate from '../VideosList/VideosListTemplate';
import {firebaseVideos, firebaseTeams, firebaseLooper} from '../../../firebase';

import './videoList.css';

class VideosList extends React.Component {
  state = {
    teams: [],
    videos: [],
    start: this.props.start,
    end: this.props.start + this.props.amount,
    amount: this.props.amount,
  }

  renderTitle = () => {
    return this.props.title 
      ? <h3><strong>NBA</strong> Videos</h3>
      : null;
  }

  componentWillMount() {
    this.request(this.state.start, this.state.end);
  }

  request = (start, end) => {
    if (this.state.teams.length < 1) {
      const teams = firebaseTeams.once('value')
        .then(snapshot => {
          const teams = firebaseLooper(snapshot);

          this.setState({
            teams,
          });
        });
    }

    firebaseVideos.orderByChild('id').startAt(start).endAt(end).once('value')
      .then(snapshot => {
        const videos = firebaseLooper(snapshot);

        this.setState({
          videos: [...this.state.videos, ...videos],
        });
      });
  }

  loadMore = () => {
    let end = this.state.end + this.state.amount;

    this.request(this.state.end + 1, end);
    this.setState({
      end,
    });
  }

  renderVideos = () => {
    let template = null;

    switch(this.props.type) {
      case 'card':
        template = <VideosTemplate data={this.state.videos} teams={this.state.teams} />
        break;
      default:
        template = null;
    }

    return template;
  }

  renderButton = () => {
    return this.props.loadmore
      ? <Button 
          type="loadmore"
          loadMore={() => this.loadMore()}
          cta="Load More Videos"
        />
      : <Button 
          type="linkTo"
          cta="More videos"
          linkTo="/videos/" 
        />;
  }

  render() {
    return (
      <div className="video-list-wrapper">
        {this.renderTitle()}
        {this.renderVideos()}
        {this.renderButton()}
      </div>
    );
  }
}

export default VideosList;