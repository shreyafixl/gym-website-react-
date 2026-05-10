const { createMockQuery, mockData } = require('../config/database-mock');

/**
 * Mock Attendance Model for Testing
 */

class MockAttendance {
  constructor(data) {
    this._doc = {
      member: data.member || null,
      checkInTime: data.checkInTime || new Date(),
      checkOutTime: data.checkOutTime || null,
      classType: data.classType || 'General Workout',
      date: data.date || new Date().toISOString().split('T')[0],
      duration: data.duration || null,
      ...data
    };
  }

  get _id() { return this._doc._id; }
  get member() { return this._doc.member; }
  get checkInTime() { return this._doc.checkInTime; }
  get checkOutTime() { return this._doc.checkOutTime; }
  get classType() { return this._doc.classType; }
  get date() { return this._doc.date; }
  get duration() { return this._doc.duration; }

  async save() {
    const existingIndex = mockData.attendance.findIndex(a => a._id === this._doc._id);
    
    if (existingIndex !== -1) {
      mockData.attendance[existingIndex] = { ...this._doc };
      return mockData.attendance[existingIndex];
    } else {
      if (!this._doc._id) {
        this._doc._id = Date.now().toString();
      }
      mockData.attendance.push({ ...this._doc });
      return this._doc;
    }
  }

  toJSON() {
    return { ...this._doc };
  }
}

// Static methods
MockAttendance.find = (filter) => {
  return createMockQuery(mockData.attendance).find(filter);
};

MockAttendance.findById = (id) => {
  return createMockQuery(mockData.attendance).findById(id);
};

MockAttendance.create = async (attendanceData) => {
  const attendance = new MockAttendance(attendanceData);
  return await attendance.save();
};

MockAttendance.findByIdAndUpdate = (id, update) => {
  return createMockQuery(mockData.attendance).findByIdAndUpdate(id, update);
};

MockAttendance.countDocuments = (filter) => {
  return createMockQuery(mockData.attendance).countDocuments(filter);
};

module.exports = MockAttendance;
