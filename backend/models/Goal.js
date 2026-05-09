const mongoose = require('mongoose');

/**
 * Goal Schema
 * Tracks member fitness goals and progress
 */
const goalSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member ID is required'],
      index: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trainer ID is required'],
      index: true,
    },
    goalTitle: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    goalDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: null,
    },
    goalType: {
      type: String,
      enum: {
        values: ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'flexibility', 'general-fitness', 'custom'],
        message: 'Invalid goal type',
      },
      required: [true, 'Goal type is required'],
      index: true,
    },
    goalCategory: {
      type: String,
      enum: {
        values: ['fitness', 'nutrition', 'lifestyle', 'health', 'performance'],
        message: 'Invalid goal category',
      },
      required: [true, 'Goal category is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
      index: true,
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'paused', 'abandoned'],
        message: 'Status must be active, completed, paused, or abandoned',
      },
      default: 'active',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    targetValue: {
      type: Number,
      default: null,
    },
    targetUnit: {
      type: String,
      enum: ['kg', 'lbs', 'cm', 'inches', 'reps', 'sets', 'minutes', 'km', 'miles', 'percentage', 'other'],
      default: null,
    },
    currentValue: {
      type: Number,
      default: null,
    },
    progress: {
      type: Number, // Percentage 0-100
      default: 0,
      min: 0,
      max: 100,
    },
    milestones: [
      {
        milestoneName: {
          type: String,
          required: true,
          trim: true,
        },
        targetValue: {
          type: Number,
          required: true,
        },
        targetDate: {
          type: Date,
          required: true,
        },
        achieved: {
          type: Boolean,
          default: false,
        },
        achievedDate: {
          type: Date,
          default: null,
        },
      },
    ],
    progressNotes: [
      {
        note: {
          type: String,
          required: true,
          trim: true,
          maxlength: [500, 'Note cannot exceed 500 characters'],
        },
        value: {
          type: Number,
          default: null,
        },
        recordedDate: {
          type: Date,
          default: Date.now,
        },
        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    achievements: [
      {
        achievementName: {
          type: String,
          required: true,
          trim: true,
        },
        achievementDescription: {
          type: String,
          trim: true,
        },
        achievedDate: {
          type: Date,
          default: Date.now,
        },
        badge: {
          type: String,
          default: null,
        },
      },
    ],
    completedDate: {
      type: Date,
      default: null,
    },
    abandonedDate: {
      type: Date,
      default: null,
    },
    abandonReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
goalSchema.index({ memberId: 1, status: 1 });
goalSchema.index({ trainerId: 1, status: 1 });
goalSchema.index({ goalType: 1, status: 1 });
goalSchema.index({ targetDate: 1, status: 1 });

/**
 * Method to update progress
 */
goalSchema.methods.updateProgress = function (currentValue, note = null, recordedBy = null) {
  this.currentValue = currentValue;

  // Calculate progress percentage
  if (this.targetValue && this.targetValue > 0) {
    this.progress = Math.min(100, Math.round((currentValue / this.targetValue) * 100));
  }

  // Add progress note
  if (note) {
    this.progressNotes.push({
      note,
      value: currentValue,
      recordedDate: Date.now(),
      recordedBy: recordedBy || this.trainerId,
    });
  }

  // Check if goal is completed
  if (this.progress >= 100 && this.status === 'active') {
    this.status = 'completed';
    this.completedDate = Date.now();
  }

  return this.save();
};

/**
 * Method to add milestone
 */
goalSchema.methods.addMilestone = function (milestoneName, targetValue, targetDate) {
  this.milestones.push({
    milestoneName,
    targetValue,
    targetDate,
    achieved: false,
  });

  return this.save();
};

/**
 * Method to achieve milestone
 */
goalSchema.methods.achieveMilestone = function (milestoneIndex) {
  if (this.milestones[milestoneIndex]) {
    this.milestones[milestoneIndex].achieved = true;
    this.milestones[milestoneIndex].achievedDate = Date.now();
  }

  return this.save();
};

/**
 * Method to add achievement
 */
goalSchema.methods.addAchievement = function (achievementName, achievementDescription = null, badge = null) {
  this.achievements.push({
    achievementName,
    achievementDescription,
    achievedDate: Date.now(),
    badge,
  });

  return this.save();
};

/**
 * Method to pause goal
 */
goalSchema.methods.pauseGoal = function () {
  this.status = 'paused';
  return this.save();
};

/**
 * Method to resume goal
 */
goalSchema.methods.resumeGoal = function () {
  if (this.status === 'paused') {
    this.status = 'active';
  }
  return this.save();
};

/**
 * Method to abandon goal
 */
goalSchema.methods.abandonGoal = function (reason) {
  this.status = 'abandoned';
  this.abandonedDate = Date.now();
  this.abandonReason = reason;
  return this.save();
};

/**
 * Method to get public profile
 */
goalSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    memberId: this.memberId,
    trainerId: this.trainerId,
    title: this.goalTitle,
    description: this.goalDescription,
    type: this.goalType,
    category: this.goalCategory,
    startDate: this.startDate,
    targetDate: this.targetDate,
    status: this.status,
    priority: this.priority,
    targetValue: this.targetValue,
    targetUnit: this.targetUnit,
    currentValue: this.currentValue,
    progress: this.progress,
    milestones: this.milestones,
    achievements: this.achievements,
    completedDate: this.completedDate,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

/**
 * Static method to get member goals
 */
goalSchema.statics.getMemberGoals = function (memberId, status = null) {
  const query = { memberId };
  if (status) query.status = status;

  return this.find(query)
    .populate('trainerId', 'fullName email')
    .sort({ targetDate: 1, priority: -1 });
};

/**
 * Static method to get completed goals
 */
goalSchema.statics.getCompletedGoals = function (memberId) {
  return this.find({ memberId, status: 'completed' })
    .populate('trainerId', 'fullName email')
    .sort({ completedDate: -1 });
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
