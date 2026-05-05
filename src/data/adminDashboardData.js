export const adminInfo = { name:"Rajesh Kumar", role:"Branch Admin", avatar:"RK", branch:"FitZone - Main Branch" };

export const kpiData = [
  { icon:"??", label:"Total Members",   value:1247, change:"+23 this month",  color:"#f97316" },
  { icon:"?", label:"Active Members",  value:1089, change:"87% active rate", color:"#22c55e" },
  { icon:"??", label:"Today Check-ins", value:142,  change:"+12 vs yesterday",color:"#3b82f6" },
  { icon:"??", label:"Monthly Revenue", value:"$48,200", change:"+8.4% vs last month", color:"#8b5cf6" },
  { icon:"??", label:"Occupancy Rate",  value:"73%", change:"Peak: 6-8 PM",   color:"#f59e0b" },
  { icon:"??", label:"New Members",     value:23,   change:"This month",      color:"#ec4899" },
];

export const revenueData = [28000,31000,29500,34000,32000,38000,36000,41000,39000,44000,42000,48200];

export const members = [
  { id:1, name:"Aryan Mehta",   email:"aryan@email.com",  plan:"Half-Yearly", status:"active",   expiry:"Aug 2025", joined:"Jan 2024", checkins:48 },
  { id:2, name:"Priya Sharma",  email:"priya@email.com",  plan:"Monthly",     status:"active",   expiry:"May 2025", joined:"Apr 2025", checkins:12 },
  { id:3, name:"Rahul Gupta",   email:"rahul@email.com",  plan:"Quarterly",   status:"active",   expiry:"Jun 2025", joined:"Mar 2025", checkins:22 },
  { id:4, name:"Neha Joshi",    email:"neha@email.com",   plan:"Annual",      status:"active",   expiry:"Nov 2025", joined:"Nov 2023", checkins:91 },
  { id:5, name:"Amit Patel",    email:"amit@email.com",   plan:"Monthly",     status:"expired",  expiry:"Apr 2025", joined:"Apr 2025", checkins:5  },
  { id:6, name:"Sunita Rao",    email:"sunita@email.com", plan:"Half-Yearly", status:"active",   expiry:"Jun 2025", joined:"Dec 2023", checkins:67 },
  { id:7, name:"Karan Mehta",   email:"karan@email.com",  plan:"Quarterly",   status:"suspended",expiry:"May 2025", joined:"Feb 2025", checkins:8  },
];

export const enquiries = [
  { id:1, name:"Deepak Singh",  email:"deepak@email.com", phone:"9876543210", interest:"Annual Plan",    date:"May 4", status:"new",         followUp:"" },
  { id:2, name:"Meera Patel",   email:"meera@email.com",  phone:"9876543211", interest:"Personal Training",date:"May 3",status:"contacted",   followUp:"Called, interested" },
  { id:3, name:"Suresh Kumar",  email:"suresh@email.com", phone:"9876543212", interest:"Monthly Plan",   date:"May 2", status:"converted",    followUp:"Joined as member" },
  { id:4, name:"Anita Sharma",  email:"anita@email.com",  phone:"9876543213", interest:"Yoga Classes",   date:"May 1", status:"not_interested",followUp:"Not interested" },
];

export const equipmentLog = [
  { id:1, name:"Treadmill #3",     status:"maintenance", lastService:"Apr 20", nextService:"May 20", issue:"Belt worn out" },
  { id:2, name:"Bench Press #2",   status:"operational", lastService:"Mar 15", nextService:"Jun 15", issue:"" },
  { id:3, name:"Rowing Machine #1",status:"out_of_order",lastService:"Apr 1",  nextService:"ASAP",   issue:"Motor failure" },
  { id:4, name:"Leg Press #1",     status:"operational", lastService:"Apr 10", nextService:"Jul 10", issue:"" },
];

export const pendingPayments = [
  { member:"Amit Patel",   plan:"Monthly",   amount:"$39",  due:"Apr 30", days:4  },
  { member:"Karan Mehta",  plan:"Quarterly", amount:"$99",  due:"May 1",  days:3  },
  { member:"Ravi Sharma",  plan:"Half-Yearly",amount:"$179",due:"May 5",  days:0  },
];
