const { createMockQuery, mockData } = require('../config/database-mock');

/**
 * Mock Branch Model for Testing
 */

class MockBranch {
  constructor(data) {
    this._doc = {
      name: data.name || '',
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
      manager: data.manager || null,
      isActive: data.isActive !== false,
      ...data
    };
  }

  get _id() { return this._doc._id; }
  get name() { return this._doc.name; }
  get address() { return this._doc.address; }
  get phone() { return this._doc.phone; }
  get email() { return this._doc.email; }
  get manager() { return this._doc.manager; }
  get isActive() { return this._doc.isActive; }

  async save() {
    const existingIndex = mockData.branches.findIndex(b => b._id === this._doc._id);
    
    if (existingIndex !== -1) {
      mockData.branches[existingIndex] = { ...this._doc };
      return mockData.branches[existingIndex];
    } else {
      if (!this._doc._id) {
        this._doc._id = Date.now().toString();
      }
      mockData.branches.push({ ...this._doc });
      return this._doc;
    }
  }

  toJSON() {
    return { ...this._doc };
  }
}

// Static methods
MockBranch.find = (filter) => {
  return createMockQuery(mockData.branches).find(filter);
};

MockBranch.findById = (id) => {
  return createMockQuery(mockData.branches).findById(id);
};

MockBranch.create = async (branchData) => {
  const branch = new MockBranch(branchData);
  return await branch.save();
};

module.exports = MockBranch;
