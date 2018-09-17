import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import SessionsCollection from '../../../api/Sessions/Sessions';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import BlankState from '../../components/BlankState/BlankState';

const StyledSessions = styled.div`
  table tbody tr td {
    vertical-align: middle;
  }
`;

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('sessions.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Session deleted!', 'success');
      }
    });
  }
};

const Sessions = ({
 loading, sessions, match, history 
}) =>
  (!loading ? (
    <StyledSessions>
      <div className="page-header clearfix">
        <h4 className="pull-left">Sessions</h4>
      </div>
      {sessions.length ? (
        <Table responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Updated</th>
              <th>Created</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {sessions.map(({ _id, title, createdAt, updatedAt }) => (
              <tr key={_id}>
                <td>{title}</td>
                <td>{timeago(updatedAt)}</td>
                <td>{monthDayYearAtTime(createdAt)}</td>
                <td>
                  <Button
                    bsStyle="primary"
                    onClick={() => history.push(`${match.url}/${_id}`)}
                    block
                  >
                    View
                  </Button>
                </td>
                <td>
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id)}
                    block
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="You're plum out of sessions, friend!"
          subtitle="Add your first session by using cmdline-cast."
        />
      )}
    </StyledSessions>
  ) : (
    <Loading />
  ));

Sessions.propTypes = {
  loading: PropTypes.bool.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('sessions');
  return {
    loading: !subscription.ready(),
    sessions: SessionsCollection.find().fetch(),
  };
})(Sessions);
