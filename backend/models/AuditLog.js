const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({

  action: {
    type: String,
    required: true
  },

  user: {
    type: String,
    default: 'system'
  },

  details: {
    type: String
  },

  status: {
    type: String,
    default: 'success'
  },

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports =
  mongoose.model(
    'AuditLog',
    AuditLogSchema
  );