/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Sessions = new Mongo.Collection('Sessions');

Sessions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Sessions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const fileSchema = new SimpleSchema({
  filename: {
    type: String,
    label: 'The filename.',
  },
  contentBefore: {
    type: String,
    label: 'The content before the operation.',
  },
  contentAfter: {
    type: String,
    label: 'The content after the operation',
  },
});

const cmdLineSchema = new SimpleSchema({
  date: {
    type: String,
    label: 'The date this line was saved.',
  },
  command: {
    type: String,
    label: 'The executed command.',
  },
  user: {
    type: String,
    label: 'The user executing the command.',
  },
  files: {
    type: Array,
    label: 'The respective files of this command',
    optional: true,
  },
  'files.$': fileSchema,
});

Sessions.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this sessions belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this session was created.',
    autoValue() {
      if (this.isInsert) return new Date().toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this session was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return new Date().toISOString();
    },
  },
  hostname: {
    type: String,
    label: 'The host of this session.',
  },
  ip: {
    type: String,
    label: 'The IP address of this session.',
  },
  commands: {
    type: Array,
    label: 'The command lines of this session.',
    optional: true,
  },
  'commands.$': cmdLineSchema,
});

Sessions.attachSchema(Sessions.schema);

export default Sessions;
