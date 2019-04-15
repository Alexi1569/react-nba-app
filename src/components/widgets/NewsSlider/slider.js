import React from 'react';
import { firebase, firebaseArticles, firebaseLooper } from '../../../firebase';

import SliderTemplates from './SliderTemplates';

class NewsSlider extends React.Component {
  state = {
    news: []
  };

  componentWillMount() {
    firebaseArticles
      .limitToFirst(3)
      .once('value')
      .then(snapshot => {
        const news = firebaseLooper(snapshot);

        const requestFunc = (item, i, cb) => {
          firebase
            .storage()
            .ref('images')
            .child(item.image)
            .getDownloadURL()
            .then(url => {
              news[i].image = url;
              cb();
            });
        };

        let requests = news.map((item, i) => {
          return new Promise((resolve, reject) => {
            requestFunc(item, i, resolve);
          });
        });

        Promise.all(requests).then(() => {
          this.setState({
            news
          });
        });
      });
  }

  render() {
    return (
      <SliderTemplates
        data={this.state.news}
        type={this.props.type}
        settings={this.props.settings}
      />
    );
  }
}

export default NewsSlider;
