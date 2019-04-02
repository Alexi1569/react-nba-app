import React from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import './cardinfo.css';

const CardInfo = (props) => {
  const teamName = (teams, team) => {
    let data = teams.find((item) => {
      return item.teamId === team;
    });

    if (data) {
      return data.name;
    }
  }

  const formatDate = (date) => {
    return moment(date).format(' MM-DD-YYYY');
  }

  return (
    <div className="cardinfo">
      <span className="cardinfo-team-name">
        {teamName(props.teams, props.team)}
      </span>
      <span className="cardinfo-date">
        <FontAwesome name="clock-o" />
        {formatDate(props.date)}
      </span>
    </div>
  )
}

export default CardInfo;