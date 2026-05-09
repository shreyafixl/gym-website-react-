/**
 * Seed Script - Create Demo Users and Data
 * Run: node backend/scripts/seedUsers.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Branch = require('../models/Branch');
const Membership = require('../models/Membership');
const Transaction = require('../models/Transaction');
const Attendance = require('../models/Attendance');

async function seedUsers() {
  try {
    console.log('🌱 Starting to seed demo data...\n');

    // Clear existing demo data
    try {
      await SuperAdmin.deleteMany({ email: { $in: ['superadmin@gym.com'] } });
      await Admin.deleteMany({ email: { $regex: 'admin.*@gym.com' } });
      await Trainer.deleteMany({ email: { $regex: 'trainer.*@gym.com' } });
      await User.deleteMany({ email: { $regex: 'user.*@gym.com' } });
      await Branch.deleteMany({ branchCode: { $regex: 'BR-' } });
      await Membership.deleteMany({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
      await Transaction.deleteMany({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
      await Attendance.deleteMany({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    } catch (err) {
      console.log('Note: Some demo data may not have existed to delete');
    }

    // Create branches
    const branches = [];
    const branchNames = ['Main Branch', 'Downtown Branch', 'Uptown Branch', 'Westside Branch', 'Eastside Branch'];
    const cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];
    
    for (let i = 0; i < 5; i++) {
      const branch = await Branch.create({
        branchName: branchNames[i],
        branchCode: `BR-${String(i + 1).padStart(3, '0')}`,
        address: `${100 + i} Fitness Street, ${cities[i]}`,
        city: cities[i],
        state: cities[i],
        pincode: `${110000 + i * 1000}`,
        contactNumber: `987654320${i}`,
        email: `branch${i + 1}@fitzone.com`,
        openingTime: '06:00',
        closingTime: '22:00',
        facilities: ['Cardio', 'Strength Training', 'Yoga', 'Swimming', 'CrossFit'],
        branchStatus: 'active',
        isActive: true,
      });
      branches.push(branch);
    }
    console.log(`✅ Created ${branches.length} branches\n`);

    // Create Super Admin
    const superAdmin = await SuperAdmin.create({
      name: 'Aditya Sharma',
      email: 'superadmin@gym.com',
      password: '12345678',
      role: 'superadmin',
      company: 'FitZone Group',
      phone: '9876543210',
      isActive: true,
    });
    console.log('✅ Super Admin created: superadmin@gym.com\n');

    // Create Admins
    const admins = [];
    for (let i = 0; i < 3; i++) {
      const admin = await Admin.create({
        name: `Admin ${i + 1}`,
        email: `admin${i + 1}@gym.com`,
        password: '12345678',
        role: 'admin',
        phone: `987654321${i}`,
        department: 'operations',
        isActive: true,
        permissions: {
          canManageUsers: true,
          canManageBranches: true,
          canManageFinance: i === 0,
          canManageTrainers: true,
          canManageClasses: true,
          canViewReports: true,
          canManageSettings: i === 0,
          canDeleteRecords: false,
        },
      });
      admins.push(admin);
    }
    console.log(`✅ Created ${admins.length} admins\n`);

    // Create Trainers
    const trainers = [];
    const trainerNames = ['Vikram Singh', 'Priya Patel', 'Rajesh Kumar', 'Neha Sharma', 'Arjun Verma', 'Sophia Khan', 'Arun Nair', 'Divya Gupta', 'Rohan Desai', 'Anjali Reddy'];
    const specializations = [
      ['strength-training', 'personal-training'],
      ['yoga', 'pilates'],
      ['cardio', 'hiit'],
      ['crossfit', 'functional-training'],
      ['pilates', 'weight-loss'],
    ];

    for (let i = 0; i < 10; i++) {
      const trainer = await Trainer.create({
        fullName: trainerNames[i],
        email: `trainer${i + 1}@gym.com`,
        password: '12345678',
        phone: `987654322${i}`,
        gender: i % 2 === 0 ? 'male' : 'female',
        specialization: specializations[i % specializations.length],
        certifications: [
          {
            name: 'NASM Certified',
            issuingOrganization: 'NASM',
          },
          {
            name: 'ACE Certified',
            issuingOrganization: 'ACE',
          },
        ],
        assignedBranch: branches[i % branches.length]._id,
        salary: {
          amount: 40000 + i * 5000,
          currency: 'INR',
          paymentFrequency: 'monthly',
        },
        isActive: true,
        joiningDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      });
      trainers.push(trainer);
    }
    console.log(`✅ Created ${trainers.length} trainers\n`);

    // Create Members
    const members = [];
    const memberNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown', 'Emily Davis', 'Chris Wilson', 'Lisa Anderson', 'David Martinez', 'Jennifer Taylor', 'Robert Garcia', 'Maria Rodriguez', 'James Lee', 'Patricia White', 'Michael Harris', 'Linda Martin', 'William Thompson', 'Barbara Jackson', 'Richard White', 'Susan Harris'];
    const fitnessGoals = ['weight-loss', 'muscle-gain', 'fitness', 'strength', 'endurance', 'flexibility', 'general-health'];
    const membershipPlans = ['monthly', 'quarterly', 'half-yearly', 'yearly'];

    for (let i = 0; i < 50; i++) {
      const member = await User.create({
        fullName: memberNames[i % memberNames.length] + (i > memberNames.length ? ` ${Math.floor(i / memberNames.length)}` : ''),
        email: `user${i + 1}@gym.com`,
        password: '12345678',
        phone: `987654${String(3200 + i).padStart(4, '0')}`,
        gender: i % 2 === 0 ? 'male' : 'female',
        age: 20 + Math.floor(Math.random() * 40),
        role: 'member',
        isActive: i % 10 !== 0, // 90% active
        emailVerified: true,
        fitnessGoal: fitnessGoals[Math.floor(Math.random() * fitnessGoals.length)],
        membershipStatus: i % 5 === 0 ? 'expired' : 'active',
        membershipPlan: membershipPlans[Math.floor(Math.random() * membershipPlans.length)],
        assignedTrainer: trainers[Math.floor(Math.random() * trainers.length)]._id,
        assignedBranch: branches[Math.floor(Math.random() * branches.length)]._id,
        membershipStartDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        membershipEndDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      });
      members.push(member);
    }
    console.log(`✅ Created ${members.length} members\n`);

    // Create Memberships
    const memberships = [];
    for (let i = 0; i < 40; i++) {
      const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000);
      const amount = 1000 + Math.floor(Math.random() * 4000);
      const discount = Math.floor(Math.random() * 200);
      
      const membership = await Membership.create({
        memberId: members[i]._id,
        membershipPlan: membershipPlans[Math.floor(Math.random() * membershipPlans.length)],
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        amount: amount,
        discount: discount,
        finalAmount: amount - discount,
        paymentStatus: 'paid',
        membershipStatus: endDate > new Date() ? 'active' : 'expired',
        assignedBranch: branches[Math.floor(Math.random() * branches.length)]._id,
        createdBy: superAdmin._id,
        createdByModel: 'SuperAdmin',
      });
      memberships.push(membership);
    }
    console.log(`✅ Created ${memberships.length} memberships\n`);

    // Create Transactions
    const transactions = [];
    const paymentMethods = ['card', 'upi', 'netbanking', 'cash', 'wallet'];
    const transactionTypes = ['membership', 'renewal', 'upgrade', 'refund', 'other'];

    for (let i = 0; i < 100; i++) {
      const transaction = await Transaction.create({
        transactionId: `TXN-${Date.now()}-${i}`,
        user: members[Math.floor(Math.random() * members.length)]._id,
        type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        amount: 500 + Math.floor(Math.random() * 5000),
        status: i % 20 === 0 ? 'failed' : 'success',
        description: `Payment for membership`,
        branch: branches[Math.floor(Math.random() * branches.length)]._id,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      transactions.push(transaction);
    }
    console.log(`✅ Created ${transactions.length} transactions\n`);

    // Create Attendance Records
    const attendanceRecords = [];
    for (let i = 0; i < 200; i++) {
      const attendanceRecord = await Attendance.create({
        memberId: members[Math.floor(Math.random() * members.length)]._id,
        trainerId: trainers[Math.floor(Math.random() * trainers.length)]._id,
        branchId: branches[Math.floor(Math.random() * branches.length)]._id,
        checkInTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        checkOutTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        attendanceStatus: 'present',
        attendanceDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      attendanceRecords.push(attendanceRecord);
    }
    console.log(`✅ Created ${attendanceRecords.length} attendance records\n`);

    console.log('✨ All demo data created successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Branches: ${branches.length}`);
    console.log(`   Trainers: ${trainers.length}`);
    console.log(`   Members: ${members.length}`);
    console.log(`   Memberships: ${memberships.length}`);
    console.log(`   Transactions: ${transactions.length}`);
    console.log(`   Attendance Records: ${attendanceRecords.length}\n`);
    console.log('📝 Demo Credentials:');
    console.log('   Super Admin: superadmin@gym.com / 12345678');
    console.log('   Admin: admin1@gym.com / 12345678');
    console.log('   Trainer: trainer1@gym.com / 12345678');
    console.log('   Member: user1@gym.com / 12345678\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedUsers();
