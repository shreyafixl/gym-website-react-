// ── Admin Info ───────────────────────────────────────────────
export const adminInfo = {
  name: "Rajesh Kumar", role: "Branch Admin", avatar: "RK", branch: "FitZone - Main Branch",
};

// ── KPI Cards ────────────────────────────────────────────────
export const kpiData = [
  { icon: "👥", label: "Total Members",   value: 1247,      change: "+23 this month",       color: "#e8622a" },
  { icon: "✅", label: "Active Members",  value: 1089,      change: "87% active rate",      color: "#22c55e" },
  { icon: "🏃", label: "Today Check-ins", value: 142,       change: "+12 vs yesterday",     color: "#3b82f6" },
  { icon: "💰", label: "Monthly Revenue", value: "$48,200", change: "+8.4% vs last month",  color: "#8b5cf6" },
  { icon: "📊", label: "Occupancy Rate",  value: "73%",     change: "Peak: 6–8 PM",         color: "#f59e0b" },
  { icon: "🆕", label: "New Members",     value: 23,        change: "This month",           color: "#ec4899" },
];

// ── Revenue (12 months) ──────────────────────────────────────
export const revenueData = [28000,31000,29500,34000,32000,38000,36000,41000,39000,44000,42000,48200];

// ── New member growth (12 months) ───────────────────────────
export const memberGrowthData = [8,12,15,10,18,22,19,25,21,28,23,23];

// ── Members ──────────────────────────────────────────────────
export const members = [
  { id:1, name:"Aryan Mehta",   email:"aryan@email.com",   phone:"9876543210", plan:"Half-Yearly", status:"active",    expiry:"Aug 2025", joined:"Jan 2024", checkins:48, trainer:"Vikram Singh"  },
  { id:2, name:"Priya Sharma",  email:"priya@email.com",   phone:"9876543211", plan:"Monthly",     status:"active",    expiry:"May 2025", joined:"Apr 2025", checkins:12, trainer:"Anjali Sharma" },
  { id:3, name:"Rahul Gupta",   email:"rahul@email.com",   phone:"9876543212", plan:"Quarterly",   status:"active",    expiry:"Jun 2025", joined:"Mar 2025", checkins:22, trainer:"Vikram Singh"  },
  { id:4, name:"Neha Joshi",    email:"neha@email.com",    phone:"9876543213", plan:"Annual",      status:"active",    expiry:"Nov 2025", joined:"Nov 2023", checkins:91, trainer:"Vikram Singh"  },
  { id:5, name:"Amit Patel",    email:"amit@email.com",    phone:"9876543214", plan:"Monthly",     status:"expired",   expiry:"Apr 2025", joined:"Apr 2025", checkins:5,  trainer:"—"             },
  { id:6, name:"Sunita Rao",    email:"sunita@email.com",  phone:"9876543215", plan:"Half-Yearly", status:"active",    expiry:"Jun 2025", joined:"Dec 2023", checkins:67, trainer:"Anjali Sharma" },
  { id:7, name:"Karan Mehta",   email:"karan@email.com",   phone:"9876543216", plan:"Quarterly",   status:"suspended", expiry:"May 2025", joined:"Feb 2025", checkins:8,  trainer:"—"             },
  { id:8, name:"Deepa Nair",    email:"deepa@email.com",   phone:"9876543217", plan:"Annual",      status:"active",    expiry:"Dec 2025", joined:"Dec 2023", checkins:104,trainer:"Vikram Singh"  },
  { id:9, name:"Ravi Sharma",   email:"ravi@email.com",    phone:"9876543218", plan:"Monthly",     status:"active",    expiry:"May 2025", joined:"May 2025", checkins:3,  trainer:"—"             },
];

// ── Trainers / Staff ─────────────────────────────────────────
export const trainers = [
  { id:1, name:"Vikram Singh",  role:"Senior Trainer",    specialization:"Bodybuilding & CrossFit", clients:8,  sessions:62, rating:4.9, status:"active",   joined:"Jan 2022", avatar:"VS" },
  { id:2, name:"Anjali Sharma", role:"Fitness Trainer",   specialization:"Yoga & Pilates",          clients:6,  sessions:48, rating:4.7, status:"active",   joined:"Mar 2022", avatar:"AS" },
  { id:3, name:"Suresh Iyer",   role:"Cardio Specialist", specialization:"HIIT & Cardio",           clients:5,  sessions:40, rating:4.6, status:"active",   joined:"Jun 2022", avatar:"SI" },
  { id:4, name:"Meena Patel",   role:"Reception",         specialization:"Front Desk",              clients:0,  sessions:0,  rating:4.8, status:"active",   joined:"Aug 2022", avatar:"MP" },
  { id:5, name:"Rohit Das",     role:"Trainer",           specialization:"Strength & Conditioning", clients:4,  sessions:31, rating:4.5, status:"on_leave", joined:"Nov 2022", avatar:"RD" },
];

// ── Classes ──────────────────────────────────────────────────
export const classes = [
  { id:1, name:"HIIT Blast",       category:"Cardio",    trainer:"Suresh Iyer",   time:"6:00 AM", days:"Mon/Wed/Fri", capacity:20, enrolled:18, status:"active"   },
  { id:2, name:"Power Yoga",       category:"Yoga",      trainer:"Anjali Sharma", time:"7:30 AM", days:"Tue/Thu/Sat", capacity:15, enrolled:12, status:"active"   },
  { id:3, name:"Strength Builder", category:"Strength",  trainer:"Vikram Singh",  time:"9:00 AM", days:"Mon–Fri",     capacity:12, enrolled:10, status:"active"   },
  { id:4, name:"Zumba Dance",      category:"Dance",     trainer:"Anjali Sharma", time:"5:30 PM", days:"Mon/Wed/Fri", capacity:25, enrolled:22, status:"active"   },
  { id:5, name:"CrossFit Pro",     category:"CrossFit",  trainer:"Vikram Singh",  time:"7:00 PM", days:"Tue/Thu",     capacity:10, enrolled:9,  status:"active"   },
  { id:6, name:"Morning Stretch",  category:"Flexibility",trainer:"Anjali Sharma",time:"6:30 AM", days:"Daily",       capacity:20, enrolled:8,  status:"inactive" },
];

// ── Enquiries ────────────────────────────────────────────────
export const enquiries = [
  { id:1, name:"Deepak Singh",  email:"deepak@email.com", phone:"9876543210", interest:"Annual Plan",       date:"May 4", status:"new",          followUp:""                    },
  { id:2, name:"Meera Patel",   email:"meera@email.com",  phone:"9876543211", interest:"Personal Training", date:"May 3", status:"contacted",    followUp:"Called, interested"  },
  { id:3, name:"Suresh Kumar",  email:"suresh@email.com", phone:"9876543212", interest:"Monthly Plan",      date:"May 2", status:"converted",    followUp:"Joined as member"    },
  { id:4, name:"Anita Sharma",  email:"anita@email.com",  phone:"9876543213", interest:"Yoga Classes",      date:"May 1", status:"not_interested",followUp:"Not interested"     },
  { id:5, name:"Nikhil Verma",  email:"nikhil@email.com", phone:"9876543219", interest:"Half-Yearly Plan",  date:"May 5", status:"new",          followUp:""                    },
  { id:6, name:"Pooja Reddy",   email:"pooja@email.com",  phone:"9876543220", interest:"CrossFit Classes",  date:"May 5", status:"contacted",    followUp:"Sent brochure"       },
];

// ── Equipment ────────────────────────────────────────────────
export const equipmentLog = [
  { id:1, name:"Treadmill #1",      category:"Cardio",    status:"operational", lastService:"Apr 10", nextService:"Jul 10", issue:""                },
  { id:2, name:"Treadmill #3",      category:"Cardio",    status:"maintenance", lastService:"Apr 20", nextService:"May 20", issue:"Belt worn out"   },
  { id:3, name:"Bench Press #2",    category:"Strength",  status:"operational", lastService:"Mar 15", nextService:"Jun 15", issue:""                },
  { id:4, name:"Rowing Machine #1", category:"Cardio",    status:"out_of_order",lastService:"Apr 1",  nextService:"ASAP",   issue:"Motor failure"   },
  { id:5, name:"Leg Press #1",      category:"Strength",  status:"operational", lastService:"Apr 10", nextService:"Jul 10", issue:""                },
  { id:6, name:"Spin Bike #2",      category:"Cardio",    status:"maintenance", lastService:"May 1",  nextService:"May 15", issue:"Resistance issue"},
  { id:7, name:"Cable Machine #1",  category:"Strength",  status:"operational", lastService:"Mar 20", nextService:"Jun 20", issue:""                },
];

// ── Pending Payments ─────────────────────────────────────────
export const pendingPayments = [
  { member:"Amit Patel",   plan:"Monthly",     amount:"$39",  due:"Apr 30", days:5,  email:"amit@email.com"   },
  { member:"Karan Mehta",  plan:"Quarterly",   amount:"$99",  due:"May 1",  days:4,  email:"karan@email.com"  },
  { member:"Ravi Sharma",  plan:"Half-Yearly", amount:"$179", due:"May 5",  days:0,  email:"ravi@email.com"   },
  { member:"Sunita Rao",   plan:"Half-Yearly", amount:"$179", due:"May 10", days:-5, email:"sunita@email.com" },
];

// ── Due Renewals ─────────────────────────────────────────────
export const dueRenewals = [
  { member:"Priya Sharma",  plan:"Monthly",     expiry:"May 31", daysLeft:26 },
  { member:"Rahul Gupta",   plan:"Quarterly",   expiry:"Jun 15", daysLeft:41 },
  { member:"Ravi Sharma",   plan:"Monthly",     expiry:"May 31", daysLeft:26 },
  { member:"Amit Patel",    plan:"Monthly",     expiry:"Expired",daysLeft:0  },
  { member:"Karan Mehta",   plan:"Quarterly",   expiry:"May 15", daysLeft:10 },
];

// ── Attendance (last 7 days) ─────────────────────────────────
export const attendanceData = [
  { day:"Mon", checkins:128 },
  { day:"Tue", checkins:142 },
  { day:"Wed", checkins:156 },
  { day:"Thu", checkins:138 },
  { day:"Fri", checkins:165 },
  { day:"Sat", checkins:189 },
  { day:"Sun", checkins:97  },
];

// ── Popular classes ──────────────────────────────────────────
export const popularClasses = [
  { name:"HIIT Blast",       bookings:312, fill:90 },
  { name:"Zumba Dance",      bookings:287, fill:82 },
  { name:"CrossFit Pro",     bookings:241, fill:75 },
  { name:"Power Yoga",       bookings:198, fill:60 },
  { name:"Strength Builder", bookings:176, fill:55 },
];
