import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {Link} from 'react-router-dom';
import {firebaseTeams, firebaseArticles, firebaseLooper} from '../../../firebase';

import './newslist.css';
import Button from '../Buttons/buttons';
import CardInfo from '../CardInfo/cardInfo';

class NewsList extends React.Component {
  state = {
    items: [],
    teams: [],
    start: this.props.start,
    end: this.props.start + this.props.amount,
    amount: this.props.amount,
  }

  componentWillMount() {
    this.request(this.state.start, this.state.end);
  }

  request = (start, end) => {
    if (this.state.teams.length < 1) {
      firebaseTeams.once('value')
        .then(snapshot => {
          const teams = firebaseLooper(snapshot);
          this.setState({
            teams,
          });
        });
    }
    
    firebaseArticles.orderByChild('id').startAt(start).endAt(end).once('value')
      .then(snapshot => {
        const articles = firebaseLooper(snapshot);
        this.setState({
          items: [...this.state.items, ...articles],
          start,
          end,
        });
      })
      .catch(err => console.log(err));
   
  }

  renderNews = (type) => {
    let template = null;

    switch (type) {
      case 'card':
        template = this.state.items.map((item, i) => (
          <CSSTransition
            key={i}
            classNames={{
              enter: "newslist-wrapper",
              enterActive: "newslist-enter"
            }}
            timeout={500}
          >
            <div>
              <div className="newslist-item">
                <Link to={`/articles/${item.id}`}>
                <CardInfo teams={this.state.teams} team={item.team} date={item.date} />
                <h2>{item.title}</h2>
                </Link>
              </div>
            </div>
          </CSSTransition>
        ));
        break;
      case 'card-main':
            template = this.state.items.map((item, i) => (
              <CSSTransition
                classNames={{
                  enter: 'newslist-wrapper',
                  enterActive: 'newslist-enter'
                }}
                timeout={500}
                key={i}
              >
                <Link
                  to={`/articles/${item.id}`}
                >
                  <div className="card-main-flex">
                    <div
                      className="card-main-left"
                      style={{
                        background: `url(/images/articles/${item.image})`
                      }}
                    >
                      <div>
                      
                      </div>
                    </div>
                    <div className="card-main-right">
                      <CardInfo 
                        teams={this.state.teams}
                        team={item.team}
                        date={item.date}
                      />
                      <h2>{item.title}</h2>
                    </div>
                  </div>
                </Link>
              </CSSTransition>
            ));
        break;
      default:
        template = null;
    }

    return template;
  }

  loadMore = () => {
    let end = this.state.end + this.state.amount;
    this.request(this.state.end + 1, end);
    this.setState({
      end
    });
  }

  render() {
    return (
      <div>
        <TransitionGroup
          component="div"
          className="list"
        >
          {this.renderNews(this.props.type)}
        </TransitionGroup>
        <Button 
          type="loadmore"
          loadMore={() => this.loadMore()}
          cta="Load More News"
        />
      </div>
    );
  }
}

export default NewsList;