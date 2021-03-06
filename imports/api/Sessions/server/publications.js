import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Sessions from '../Sessions';

Meteor.publish('sessions', () => Sessions.find(/* { owner: this.userId } */));

// Note: sessions.view is also used when editing an existing session.
Meteor.publish('sessions.view', (sessionId) => {
  check(sessionId, String);
  return Sessions.find({ _id: sessionId });
});

Meteor.publish('sessions.edit', function sessionsEdit(sessionId) {
  check(sessionId, String);
  return Sessions.find({ _id: sessionId, owner: this.userId });
});
