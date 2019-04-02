import React from 'react';
import './videoList.css';
import {Link} from 'react-router-dom';
import CardInfo from '../CardInfo/cardInfo';

const VideosListTempalate = (props) => {
  return props.data.map((item, i) => (
    <Link
      to={`/videos/${item.id}`}
      key={i}
    >
      <div className="videos-list-item-wrapper">
        <div 
          className="video-list-item-left"
          style={{
            background: `url(/images/videos/${item.image})`
          }}
        >
          <div>
          
          </div>
        </div>
        <div className="video-list-item-right">
          <CardInfo 
            teams={props.teams}
            team={item.team}
            date={item.date}
          />
          <h2>{item.title}</h2>
        </div>
      </div>
    </Link>
  ));
}

export default VideosListTempalate;