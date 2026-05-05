export const trainerInfo = {
  name: "Vikram Singh", role: "Senior Trainer", avatar: "VS",
  specialization: "Bodybuilding & CrossFit", experience: "9 Years",
  rating: 4.9, totalClients: 24, activeClients: 18, todayRevenue: 590,
  monthRevenue: 8400, sessionsThisMonth: 62,
};

export const todaySchedule = [
  { id:1, time:"6:00 AM", client:"Aryan Mehta",    type:"PT Session",   status:"completed", duration:"60 min" },
  { id:2, time:"7:30 AM", client:"Priya Sharma",   type:"PT Session",   status:"completed", duration:"45 min" },
  { id:3, time:"9:00 AM", client:"Group - HIIT",   type:"Group Class",  status:"ongoing",   duration:"30 min" },
  { id:4, time:"11:00 AM",client:"Rahul Gupta",    type:"PT Session",   status:"upcoming",  duration:"60 min" },
  { id:5, time:"5:30 PM", client:"Group - Strength",type:"Group Class", status:"upcoming",  duration:"60 min" },
  { id:6, time:"7:00 PM", client:"Neha Joshi",     type:"PT Session",   status:"upcoming",  duration:"45 min" },
];

export const pendingTasks = [
  { id:1, task:"Mark attendance - HIIT Blast (9 AM)",  priority:"high",   done:false },
  { id:2, task:"Send progress report to Aryan Mehta",  priority:"medium", done:false },
  { id:3, task:"Update workout plan for Priya Sharma", priority:"medium", done:true  },
  { id:4, task:"Follow up with Rahul Gupta re: diet",  priority:"low",    done:false },
  { id:5, task:"Review new client intake form",        priority:"high",   done:false },
];

export const clients = [
  { id:1, name:"Aryan Mehta",   avatar:"AM", photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", lastVisit:"Today",    progress:72, plan:"Strength Builder", goal:"Muscle Gain",  status:"active",   sessions:18, weight:"72 kg", joined:"Jan 2024" },
  { id:2, name:"Priya Sharma",  avatar:"PS", photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", lastVisit:"Yesterday",progress:58, plan:"Weight Loss",      goal:"Fat Loss",     status:"active",   sessions:12, weight:"61 kg", joined:"Feb 2024" },
  { id:3, name:"Rahul Gupta",   avatar:"RG", photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", lastVisit:"3 days ago",progress:45, plan:"Beginner Fitness", goal:"General Fit",  status:"active",   sessions:8,  weight:"85 kg", joined:"Mar 2024" },
  { id:4, name:"Neha Joshi",    avatar:"NJ", photo:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", lastVisit:"Today",    progress:88, plan:"Advanced CrossFit",goal:"Performance",  status:"active",   sessions:31, weight:"58 kg", joined:"Nov 2023" },
  { id:5, name:"Amit Patel",    avatar:"AP", photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", lastVisit:"1 week ago",progress:30, plan:"Beginner Fitness", goal:"Weight Loss",  status:"inactive", sessions:5,  weight:"92 kg", joined:"Apr 2024" },
  { id:6, name:"Sunita Rao",    avatar:"SR", photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80", lastVisit:"2 days ago",progress:65, plan:"Yoga & Flexibility",goal:"Flexibility",  status:"active",   sessions:22, weight:"55 kg", joined:"Dec 2023" },
];

export const clientProgressNotes = [
  { date:"May 3", note:"Increased deadlift to 100kg. Excellent form maintained throughout.", trainer:"Vikram" },
  { date:"Apr 26", note:"Completed 5k run in 28 mins. Cardio improving steadily.", trainer:"Vikram" },
  { date:"Apr 19", note:"Struggling with pull-ups. Added assisted pull-up work to plan.", trainer:"Vikram" },
];

export const exerciseLibrary = [
  { id:1, name:"Barbell Squat",    muscle:"Legs",     equipment:"Barbell",    sets:"4x8",  rest:"90s" },
  { id:2, name:"Bench Press",      muscle:"Chest",    equipment:"Barbell",    sets:"4x8",  rest:"90s" },
  { id:3, name:"Deadlift",         muscle:"Back",     equipment:"Barbell",    sets:"3x5",  rest:"120s"},
  { id:4, name:"Pull-ups",         muscle:"Back",     equipment:"Bodyweight", sets:"3x10", rest:"60s" },
  { id:5, name:"Shoulder Press",   muscle:"Shoulders",equipment:"Dumbbell",   sets:"3x12", rest:"60s" },
  { id:6, name:"Plank",            muscle:"Core",     equipment:"Bodyweight", sets:"3x60s",rest:"30s" },
  { id:7, name:"Lunges",           muscle:"Legs",     equipment:"Dumbbell",   sets:"3x12", rest:"60s" },
  { id:8, name:"Bicep Curl",       muscle:"Arms",     equipment:"Dumbbell",   sets:"3x15", rest:"45s" },
  { id:9, name:"Tricep Dips",      muscle:"Arms",     equipment:"Bodyweight", sets:"3x12", rest:"45s" },
  { id:10,name:"Box Jumps",        muscle:"Legs",     equipment:"Box",        sets:"4x10", rest:"60s" },
  { id:11,name:"Cable Row",        muscle:"Back",     equipment:"Cable",      sets:"3x12", rest:"60s" },
  { id:12,name:"Leg Press",        muscle:"Legs",     equipment:"Machine",    sets:"4x12", rest:"90s" },
];

export const workoutTemplates = [
  { id:1, name:"Beginner Full Body",    level:"Beginner",     days:3, exercises:8,  clients:5 },
  { id:2, name:"Intermediate Strength", level:"Intermediate", days:4, exercises:12, clients:8 },
  { id:3, name:"Advanced CrossFit",     level:"Advanced",     days:5, exercises:16, clients:3 },
  { id:4, name:"Weight Loss Circuit",   level:"Beginner",     days:4, exercises:10, clients:6 },
  { id:5, name:"Muscle Building Split", level:"Intermediate", days:5, exercises:14, clients:4 },
];

export const trainerMessages = [
  { id:1, client:"Aryan Mehta",  avatar:"AM", lastMsg:"Thanks coach! See you tomorrow 💪", time:"2h ago",  unread:0 },
  { id:2, client:"Priya Sharma", avatar:"PS", lastMsg:"Can we reschedule Friday's session?", time:"4h ago",  unread:2 },
  { id:3, client:"Neha Joshi",   avatar:"NJ", lastMsg:"My knee is feeling better now",       time:"Yesterday",unread:1 },
  { id:4, client:"Rahul Gupta",  avatar:"RG", lastMsg:"What should I eat before workout?",   time:"2 days ago",unread:0 },
];

export const trainerReports = {
  attendanceRate: 87,
  clientRetention: 92,
  avgSessionRating: 4.8,
  monthlyRevenue: [4200,5100,4800,6200,5900,7100,6800,7400,8100,7800,8400,9200],
  classAttendance: [
    { class:"HIIT Blast",      rate:94, sessions:18 },
    { class:"Strength Builder",rate:88, sessions:22 },
    { class:"CrossFit",        rate:79, sessions:14 },
    { class:"Boxing Basics",   rate:91, sessions:10 },
  ],
};

export const calendarEvents = [
  { id:1, title:"PT - Aryan",    date:"2025-05-05", time:"6:00 AM",  type:"pt",    color:"#f97316" },
  { id:2, title:"HIIT Blast",    date:"2025-05-05", time:"9:00 AM",  type:"class", color:"#3b82f6" },
  { id:3, title:"PT - Neha",     date:"2025-05-05", time:"7:00 PM",  type:"pt",    color:"#f97316" },
  { id:4, title:"Strength Class",date:"2025-05-06", time:"5:30 PM",  type:"class", color:"#3b82f6" },
  { id:5, title:"PT - Priya",    date:"2025-05-07", time:"7:30 AM",  type:"pt",    color:"#f97316" },
  { id:6, title:"CrossFit",      date:"2025-05-08", time:"6:00 PM",  type:"class", color:"#3b82f6" },
  { id:7, title:"PT - Rahul",    date:"2025-05-09", time:"11:00 AM", type:"pt",    color:"#f97316" },
];
