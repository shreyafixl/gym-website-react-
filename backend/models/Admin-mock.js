const bcrypt = require('bcryptjs');
const { createMockQuery, mockData } = require('../config/database-mock');

/**
 * Mock Admin Model for Testing
 * Provides in-memory admin user management when MongoDB is not available
 */

class MockAdmin {
  constructor(data) {
    this._doc = {
      name: data.name || '',
      email: data.email || '',
      password: data.password || '',
      role: data.role || 'admin',
      phone: data.phone || '',
      avatar: data.avatar || null,
      department: data.department || 'general',
      isActive: data.isActive !== false,
      permissions: data.permissions || {},
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      ...data
    };
  }

  // Getters for accessing document properties
  get _id() { return this._doc._id; }
  get name() { return this._doc.name; }
  get email() { return this._doc.email; }
  get password() { return this._doc.password; }
  get role() { return this._doc.role; }
  get phone() { return this._doc.phone; }
  get avatar() { return this._doc.avatar; }
  get department() { return this._doc.department; }
  get isActive() { return this._doc.isActive; }
  get permissions() { return this._doc.permissions; }
  get loginAttempts() { return this._doc.loginAttempts; }
  get lockUntil() { return this._doc.lockUntil; }
  get lastLogin() { return this._doc.lastLogin; }
  get createdAt() { return this._doc.createdAt; }
  get updatedAt() { return this._doc.updatedAt; }

  // Instance methods
  async comparePassword(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this._doc.password);
    } catch (error) {
      console.error('Password comparison error:', error);
      return false;
    }
  }

  isLocked() {
    return !!(this._doc.lockUntil && this._doc.lockUntil > Date.now());
  }

  async incLoginAttempts() {
    // If we have a previous lock that has expired, restart at 1
    if (this._doc.lockUntil && this._doc.lockUntil < Date.now()) {
      return this.updateOne({ $unset: { lockUntil: 1 }, $set: { loginAttempts: 1 } });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock account after 5 failed attempts for 2 hours
    if (this._doc.loginAttempts + 1 >= 5 && !this.isLocked()) {
      updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }
    
    return this.updateOne(updates);
  }

  async save() {
    this._doc.updatedAt = new Date();
    
    // Find existing admin or create new one
    const existingIndex = mockData.admins.findIndex(a => a._id === this._doc._id);
    
    if (existingIndex !== -1) {
      mockData.admins[existingIndex] = { ...this._doc };
      return mockData.admins[existingIndex];
    } else {
      // Generate new ID if not exists
      if (!this._doc._id) {
        this._doc._id = Date.now().toString();
      }
      mockData.admins.push({ ...this._doc });
      return this._doc;
    }
  }

  async updateOne(updates) {
    const adminIndex = mockData.admins.findIndex(a => a._id === this._doc._id);
    if (adminIndex !== -1) {
      if (updates.$set) {
        Object.assign(mockData.admins[adminIndex], updates.$set);
      }
      if (updates.$inc) {
        Object.keys(updates.$inc).forEach(key => {
          mockData.admins[adminIndex][key] = (mockData.admins[adminIndex][key] || 0) + updates.$inc[key];
        });
      }
      if (updates.$unset) {
        Object.keys(updates.$unset).forEach(key => {
          delete mockData.admins[adminIndex][key];
        });
      }
      mockData.admins[adminIndex].updatedAt = new Date();
      Object.assign(this._doc, mockData.admins[adminIndex]);
    }
    return this;
  }

  toJSON() {
    const { password, loginAttempts, lockUntil, ...rest } = this._doc;
    return rest;
  }
}

// Static methods
MockAdmin.findOne = (filter) => {
  return createMockQuery(mockData.admins).findOne(filter);
};

MockAdmin.findById = (id) => {
  return createMockQuery(mockData.admins).findById(id);
};

MockAdmin.find = (filter) => {
  return createMockQuery(mockData.admins).find(filter);
};

MockAdmin.create = async (adminData) => {
  // Hash password before saving
  if (adminData.password) {
    const salt = await bcrypt.genSalt(12);
    adminData.password = await bcrypt.hash(adminData.password, salt);
  }

  const admin = new MockAdmin(adminData);
  return await admin.save();
};

MockAdmin.findByIdAndUpdate = (id, update, options = {}) => {
  return createMockQuery(mockData.admins).findByIdAndUpdate(id, update);
};

MockAdmin.findByIdAndDelete = (id) => {
  return createMockQuery(mockData.admins).findByIdAndDelete(id);
};

MockAdmin.countDocuments = (filter) => {
  return createMockQuery(mockData.admins).countDocuments(filter);
};

// Helper method to find by email (used in auth)
MockAdmin.findByEmail = async (email) => {
  const admin = mockData.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  return admin ? new MockAdmin(admin) : null;
};

// Pre-save middleware for password hashing
MockAdmin.preSave = async (adminData) => {
  if (adminData.password && !adminData.password.startsWith('$2')) {
    const salt = await bcrypt.genSalt(12);
    adminData.password = await bcrypt.hash(adminData.password, salt);
  }
};

// Initialize default admin if not exists
const initializeDefaultAdmin = async () => {
  try {
    const existingAdmin = mockData.admins.find(a => a.email === 'admin@fitzone.com');
    
    if (!existingAdmin) {
      const defaultAdmin = {
        name: 'Rajesh Kumar',
        email: 'admin@fitzone.com',
        password: 'Admin@123', // This will be hashed
        role: 'admin',
        department: 'general',
        isActive: true,
        permissions: {
          users: true,
          analytics: true,
          settings: true,
          memberships: true,
          attendance: true,
          trainers: true,
          branches: true,
          schedules: true,
          workouts: true,
          communication: true,
          support: true
        }
      };

      await MockAdmin.preSave(defaultAdmin);
      const admin = new MockAdmin(defaultAdmin);
      await admin.save();
      
      console.log('✅ Default admin user created:');
      console.log('   Email: admin@fitzone.com');
      console.log('   Password: Admin@123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Initialize default admin
initializeDefaultAdmin();

module.exports = MockAdmin;
