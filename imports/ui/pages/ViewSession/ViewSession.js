import React from 'react';
import PropTypes from 'prop-types';
import { Fade, Well } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../../api/Sessions/Sessions';
import NotFound from '../NotFound/NotFound';
import { time } from '../../../modules/dates';

const renderSession = (session, match, history) =>
  (session ? (
    <div className="ViewSession">
      <div className="page-header clearfix">
        <h4 className="pull-left">{session && session.hostname}</h4>
      </div>
      {session &&
        session.commands &&
        session.commands.reverse().map(({
 date, command, user, directory,
}, i) => (
  <Fade in key={date}>
    <div>

      <pre><small className="pull-right">
        {time(date)}
           </small>{user}@{directory} $ <b>{command}</b>
      </pre>
    </div>
  </Fade>
        ))}
    </div>
  ) : (
    <NotFound />
  ));

const ViewSession = ({ session, match, history }) =>
  renderSession(session, match, history);

ViewSession.defaultProps = {
  session: null,
};

ViewSession.propTypes = {
  session: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({ ...state })),
  withTracker(({ match }) => {
    const sessionId = match.params._id;

    if (Meteor.isClient) Meteor.subscribe('sessions.view', sessionId);

    return {
      session: Sessions.findOne(sessionId),
    };
  }),
)(ViewSession);
