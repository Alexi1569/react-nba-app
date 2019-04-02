import React from 'react';
import TeamInfo from '../../Elements/teamInfo';

const VideoHeader = (props) => {

  const teamInfo = (team) => {
    return team
      ? <TeamInfo team={team} />
      : null;
  }

  return (
    <div>
      {teamInfo(props.teamData)}
    </div>
  )
}

export default VideoHeader;