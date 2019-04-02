import React from 'react';
import '../videoList.css';
import VideoListTemplate from '../VideosListTemplate';

const VideosRelated = (props) => (
  <div className="related-wrapper">
    <VideoListTemplate 
      data={props.data}
      teams={props.teams}
    />
  </div>
);

export default VideosRelated;