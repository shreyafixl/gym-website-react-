const { createMockQuery, mockData } = require('../config/database-mock');

/**
 * Mock User Model for Testing
 * Provides in-memory user management when MongoDB is not available
 */

class MockUser {
  constructor(data) {
    this._doc = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      gender: data.gender || '',
      age: data.age || 0,
      role: data.role || 'member',
      isActive: data.isActive !== false,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      ...data
    };
  }

  // Getters
  get _id() { return this._doc._id; }
  get fullName() { return this._doc.fullName; }
  get email() { return this._doc.email; }
  get phone() { return this._doc.phone; }
  get gender() { return this._doc.gender; }
  get age() { return this._doc.age; }
  get role() { return this._doc.role; }
  get isActive() { return this._doc.isActive; }
  get createdAt() { return this._doc.createdAt; }
  get updatedAt() { return this._doc.updatedAt; }

  async save() {
    this._doc.updatedAt = new Date();
    
    const existingIndex = mockData.users.findIndex(u => u._id === this._doc._id);
    
    if (existingIndex !== -1) {
      mockData.users[existingIndex] = { ...this._doc };
      return mockData.users[existingIndex];
    } else {
      if (!this._doc._id) {
        this._doc._id = Date.now().toString();
      }
      mockData.users.push({ ...this._doc });
      return this._doc;
    }
  }

  toJSON() {
    return { ...this._doc };
  }
}

// Static methods
MockUser.findOne = (filter) => {
  return createMockQuery(mockData.users).findOne(filter);
};

MockUser.findById = (id) => {
  return createMockQuery(mockData.users).findById(id);
};

MockUser.find = (filter) => {
  return createMockQuery(mockData.users).find(filter);
};

MockUser.create = async (userData) => {
  const user = new MockUser(userData);
  return await user.save();
};

MockUser.findByIdAndUpdate = (id, update, options = {}) => {
  return createMockQuery(mockData.users).findByIdAndUpdate(id, update);
};

MockUser.findByIdAndDelete = (id) => {
  return createMockQuery(mockData.users).findByIdAndDelete(id);
};

MockUser.countDocuments = (filter) => {
  return createMockQuery(mockData.users).countDocuments(filter);
};

module.exports = MockUser;
