const mongoose = require('mongoose');

/**
 * Notification Schema
 * Defines the structure for system notifications
 */
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['info', 'warning', 'success', 'alert'],
        message: 'Type must be info, warning, success, or alert',
      },
      default: 'info',
    },
    recipientType: {
      type: String,
      enum: {
        values: ['all', 'users', 'trainers', 'admins', 'branches', 'specific'],
        message: 'Recipient type must be all, users, trainers, admins, branches, or specific',
      },
      required: [true, 'Recipient type is required'],
    },
    recipientIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    branchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['pending', 'sent', 'failed'],
        message: 'Status must be pending, sent, or failed',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be low, medium, high, or urgent',
      },
      default: 'medium',
    },
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    actionUrl: {
      type: String,
      default: null,
    },
    actionLabel: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SuperAdmin',
      required: [true, 'Creator is required'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipientType: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 });

/**
 * Method to get public notification profile
 */
notificationSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    title: this.title,
    message: this.message,
    type: this.type,
    recipientType: this.recipientType,
    recipientIds: this.recipientIds,
    branchIds: this.branchIds,
    status: this.status,
    priority: this.priority,
    readCount: this.readBy.length,
    actionUrl: this.actionUrl,
    actionLabel: this.actionLabel,
    expiresAt: this.expiresAt,
    isExpired: this.isExpired(),
    createdBy: this.createdBy,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

/**
 * Method to check if notification is expired
 */
notificationSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

/**
 * Method to mark as read by user
 */
notificationSchema.methods.markAsRead = function (userId) {
  const alreadyRead = this.readBy.some((read) => read.userId.toString() === userId.toString());
  if (!alreadyRead) {
    this.readBy.push({ userId, readAt: new Date() });
  }
  return this.save();
};

/**
 * Method to check if user has read notification
 */
notificationSchema.methods.isReadBy = function (userId) {
  return this.readBy.some((read) => read.userId.toString() === userId.toString());
};

/**
 * Static method to get notifications for user
 */
notificationSchema.statics.getForUser = function (userId, userRole) {
  const query = {
    $or: [
      { recipientType: 'all' },
      { recipientType: userRole + 's' },
      { recipientIds: userId },
    ],
    status: 'sent',
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  };
  return this.find(query).sort({ createdAt: -1 });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
