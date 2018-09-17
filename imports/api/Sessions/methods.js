/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Sessions from './Sessions';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'sessions.findOne': function sessionsFindOne(sessionId) {
    check(sessionId, Match.OneOf(String, undefined));

    try {
      return Sessions.findOne(sessionId);
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'sessions.insert': function sessionsInsert(doc) {
    check(doc, {
      hostname: String,
      ip: String,
    });

    try {
      return Sessions.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'sessions.remove': function sessionsRemove(sessionId) {
    check(sessionId, String);

    try {
      const docToRemove = Sessions.findOne(sessionId, { fields: { owner: 1 } });

      if (docToRemove.owner === this.userId) {
        return Sessions.remove(sessionId);
      }

      throw new Meteor.Error('403', 'Sorry. You\'re not allowed to delete this session.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
});

rateLimit({
  methods: [
    'sessions.insert',
    'sessions.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
