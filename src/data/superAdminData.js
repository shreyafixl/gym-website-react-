export const superAdminInfo = {
  name: "Aditya Sharma", role: "Super Admin", avatar: "AS", company: "FitZone Group",
};

export const globalStats = [
  { label:"Total Branches",   value:"4",       icon:"🏢", change:"1 new this year",    color:"#3b82f6" },
  { label:"Total Members",    value:"4,820",   icon:"👥", change:"+312 this month",    color:"#22c55e" },
  { label:"Total Revenue",    value:"$1.84M",  icon:"💰", change:"+22% YoY",           color:"#f97316" },
  { label:"Active Trainers",  value:"28",      icon:"🏋️", change:"Across all branches",color:"#8b5cf6" },
  { label:"Platform Health",  value:"99.8%",   icon:"💚", change:"Uptime this month",  color:"#22c55e" },
  { label:"Churn Rate",       value:"3.2%",    icon:"📉", change:"-0.8% vs last month",color:"#ef4444" },
];

export const branches = [
  { id:1, name:"FitZone Main",    city:"Mumbai",    members:1284, revenue:"$42.8K", trainers:8, status:"active",   growth:"+12%" },
  { id:2, name:"FitZone North",   city:"Delhi",     members:1120, revenue:"$38.2K", trainers:7, status:"active",   growth:"+8%"  },
  { id:3, name:"FitZone South",   city:"Bangalore", members:980,  revenue:"$33.1K", trainers:6, status:"active",   growth:"+15%" },
  { id:4, name:"FitZone West",    city:"Pune",      members:436,  revenue:"$14.6K", trainers:4, status:"new",      growth:"+42%" },
];

export const allUsers = [
  { id:1,  name:"Aryan Mehta",   email:"aryan@email.com",   role:"member",     branch:"Main",    status:"active",   lastLogin:"Today"     },
  { id:2,  name:"Vikram Singh",  email:"vikram@email.com",  role:"trainer",    branch:"Main",    status:"active",   lastLogin:"Today"     },
  { id:3,  name:"Rajesh Kumar",  email:"rajesh@email.com",  role:"admin",      branch:"Main",    status:"active",   lastLogin:"Today"     },
  { id:4,  name:"Anjali Sharma", email:"anjali@email.com",  role:"trainer",    branch:"North",   status:"active",   lastLogin:"Yesterday" },
  { id:5,  name:"Priya Sharma",  email:"priya@email.com",   role:"member",     branch:"Main",    status:"active",   lastLogin:"Today"     },
  { id:6,  name:"Suresh Iyer",   email:"suresh@email.com",  role:"member",     branch:"South",   status:"active",   lastLogin:"2 days ago"},
  { id:7,  name:"Meena Patel",   email:"meena@email.com",   role:"reception",  branch:"Main",    status:"active",   lastLogin:"Today"     },
  { id:8,  name:"Amit Patel",    email:"amit@email.com",    role:"member",     branch:"West",    status:"inactive", lastLogin:"1 week ago"},
];

export const membershipPlans = [
  { id:1, name:"Monthly",     price:"$39",  duration:"1 month",  members:284, status:"active",   popular:false },
  { id:2, name:"Quarterly",   price:"$99",  duration:"3 months", members:412, status:"active",   popular:false },
  { id:3, name:"Half-Yearly", price:"$179", duration:"6 months", members:680, status:"active",   popular:true  },
  { id:4, name:"Annual",      price:"$299", duration:"12 months",members:520, status:"active",   popular:false },
  { id:5, name:"Student",     price:"$29",  duration:"1 month",  members:124, status:"active",   popular:false },
  { id:6, name:"Corporate",   price:"$199", duration:"3 months", members:89,  status:"active",   popular:false },
];

export const auditLog = [
  { id:1,  user:"Rajesh Kumar",  action:"Updated member plan",         target:"Aryan Mehta",    time:"Today 10:24 AM",  ip:"192.168.1.10" },
  { id:2,  user:"Vikram Singh",  action:"Added progress note",         target:"Priya Sharma",   time:"Today 9:15 AM",   ip:"192.168.1.22" },
  { id:3,  user:"Aditya Sharma", action:"Created new branch",          target:"FitZone West",   time:"Yesterday 3:00 PM",ip:"10.0.0.1"    },
  { id:4,  user:"Rajesh Kumar",  action:"Suspended member account",    target:"Divya Singh",    time:"Yesterday 11:30 AM",ip:"192.168.1.10"},
  { id:5,  user:"Meena Patel",   action:"Registered new member",       target:"Vikash Nair",    time:"May 3, 2:15 PM",  ip:"192.168.1.30" },
  { id:6,  user:"Aditya Sharma", action:"Changed role",                target:"Meena Patel → Reception",time:"May 2, 4:00 PM",ip:"10.0.0.1"},
];

export const financialReports = {
  yearly: [
    { month:"Jun",revenue:28400 },{ month:"Jul",revenue:31200 },{ month:"Aug",revenue:29800 },
    { month:"Sep",revenue:33400 },{ month:"Oct",revenue:36100 },{ month:"Nov",revenue:38200 },
    { month:"Dec",revenue:41800 },{ month:"Jan",revenue:39200 },{ month:"Feb",revenue:42100 },
    { month:"Mar",revenue:44800 },{ month:"Apr",revenue:47200 },{ month:"May",revenue:51400 },
  ],
  churnData: [
    { month:"Nov",rate:4.8 },{ month:"Dec",rate:4.2 },{ month:"Jan",rate:3.9 },
    { month:"Feb",rate:3.7 },{ month:"Mar",rate:3.5 },{ month:"Apr",rate:3.2 },
  ],
};

export const systemSettings = {
  gymName: "FitZone Fitness Group",
  logo: "⚡",
  email: "admin@fitzone.com",
  phone: "+91 98765 00000",
  timezone: "Asia/Kolkata",
  currency: "USD",
  emailNotifications: true,
  smsNotifications: false,
  autoBackup: true,
  backupFrequency: "Daily",
  maintenanceMode: false,
};
