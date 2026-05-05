// Mock data for the User Dashboard

export const userData = {
  name: "Aryan Mehta",
  email: "aryan.mehta@email.com",
  avatar: "AM",
  memberSince: "Jan 2024",
  phone: "+91 98765 43210",
  plan: "Half-Yearly",
  membershipPlan: "Half-Yearly",
  membershipExpiry: "2025-08-15",
  planExpiry: "Aug 15, 2025",
  daysLeft: 104,
  memberId: "FZ-2024-0847",
  streak: 14,
  attendanceStreak: 14,
  bmi: 22.4,
  fitnessScore: 78,
  weight: 72,
  height: 175,
  targetWeight: 70,
  totalSessions: 48,
  caloriesBurned: 24800,
  assignedTrainer: 4,
};

export const quickStats = [
  { label: "Sessions Attended", value: 48, icon: "🏋️", change: "+6 this month", color: "#f97316" },
  { label: "Calories Burned", value: "24,800", icon: "🔥", change: "+1,200 this week", color: "#ef4444" },
  { label: "Weight Progress", value: "-4.2 kg", icon: "⚖️", change: "Since joining", color: "#22c55e" },
  { label: "Active Days", value: 22, icon: "📅", change: "This month", color: "#3b82f6" },
];

export const upcomingBookings = [
  { id: 1, class: "HIIT Blast", trainer: "Rohit Verma", date: "Today", time: "6:00 PM", status: "confirmed", type: "Group Class", slot: "12/15" },
  { id: 2, class: "Personal Training", trainer: "Vikram Singh", date: "Tomorrow", time: "7:30 AM", status: "confirmed", type: "PT Session", slot: "1/1" },
  { id: 3, class: "Yoga Flow", trainer: "Anjali Sharma", date: "Wed, May 7", time: "8:00 AM", status: "pending", type: "Group Class", slot: "8/15" },
  { id: 4, class: "Strength Builder", trainer: "Vikram Singh", date: "Fri, May 9", time: "5:30 PM", status: "confirmed", type: "Group Class", slot: "10/15" },
];

export const weightLog = [
  { date: "Jan 1", weight: 76.2 },
  { date: "Jan 15", weight: 75.4 },
  { date: "Feb 1", weight: 74.8 },
  { date: "Feb 15", weight: 74.1 },
  { date: "Mar 1", weight: 73.5 },
  { date: "Mar 15", weight: 73.0 },
  { date: "Apr 1", weight: 72.6 },
  { date: "Apr 15", weight: 72.0 },
  { date: "May 1", weight: 72.0 },
];

export const measurements = [
  { part: "Chest", current: "96 cm", start: "102 cm", change: "-6 cm" },
  { part: "Waist", current: "82 cm", start: "89 cm", change: "-7 cm" },
  { part: "Hips", current: "94 cm", start: "97 cm", change: "-3 cm" },
  { part: "Arms", current: "35 cm", start: "33 cm", change: "+2 cm" },
  { part: "Thighs", current: "56 cm", start: "59 cm", change: "-3 cm" },
];

export const workoutHistory = [
  { id: 1, date: "May 3, 2025", class: "HIIT Blast", trainer: "Rohit Verma", duration: "30 min", calories: 420, rating: 5 },
  { id: 2, date: "May 1, 2025", class: "Strength Builder", trainer: "Vikram Singh", duration: "60 min", calories: 380, rating: 4 },
  { id: 3, date: "Apr 29, 2025", class: "Yoga Flow", trainer: "Anjali Sharma", duration: "45 min", calories: 210, rating: 5 },
  { id: 4, date: "Apr 27, 2025", class: "Boxing Basics", trainer: "Arjun Rao", duration: "40 min", calories: 390, rating: 4 },
  { id: 5, date: "Apr 25, 2025", class: "Cardio Burn", trainer: "Priya Mehta", duration: "35 min", calories: 310, rating: 3 },
  { id: 6, date: "Apr 23, 2025", class: "CrossFit Challenge", trainer: "Vikram Singh", duration: "60 min", calories: 510, rating: 5 },
];

export const weeklySchedule = [
  {
    day: "Mon",
    classes: [
      { time: "6:00 AM", name: "Yoga Flow", trainer: "Anjali", status: "available", spots: 8 },
      { time: "5:30 PM", name: "HIIT Blast", trainer: "Rohit", status: "live", spots: 3 },
      { time: "7:00 PM", name: "Strength Builder", trainer: "Vikram", status: "available", spots: 5 },
    ]
  },
  {
    day: "Tue",
    classes: [
      { time: "7:00 AM", name: "Cardio Burn", trainer: "Priya", status: "available", spots: 12 },
      { time: "6:00 PM", name: "Boxing Basics", trainer: "Arjun", status: "booked", spots: 0 },
    ]
  },
  {
    day: "Wed",
    classes: [
      { time: "8:00 AM", name: "Yoga Flow", trainer: "Anjali", status: "booked", spots: 0 },
      { time: "5:00 PM", name: "Zumba Dance", trainer: "Neha", status: "available", spots: 6 },
      { time: "7:00 PM", name: "Pilates Core", trainer: "Simran", status: "available", spots: 9 },
    ]
  },
  {
    day: "Thu",
    classes: [
      { time: "6:30 AM", name: "Functional Fitness", trainer: "Arjun", status: "available", spots: 7 },
      { time: "6:00 PM", name: "HIIT Blast", trainer: "Rohit", status: "full", spots: 0 },
    ]
  },
  {
    day: "Fri",
    classes: [
      { time: "7:00 AM", name: "Strength Builder", trainer: "Vikram", status: "available", spots: 4 },
      { time: "5:30 PM", name: "Strength Builder", trainer: "Vikram", status: "booked", spots: 0 },
      { time: "7:30 PM", name: "CrossFit Challenge", trainer: "Vikram", status: "available", spots: 2 },
    ]
  },
  {
    day: "Sat",
    classes: [
      { time: "9:00 AM", name: "Zumba Dance", trainer: "Neha", status: "available", spots: 10 },
      { time: "11:00 AM", name: "Yoga Flow", trainer: "Anjali", status: "available", spots: 11 },
    ]
  },
  {
    day: "Sun",
    classes: [
      { time: "10:00 AM", name: "Bodybuilding Basics", trainer: "Rohit", status: "available", spots: 8 },
    ]
  },
];

export const assignedTrainer = {
  name: "Vikram Singh",
  specialization: "Bodybuilding & CrossFit",
  experience: "9 Years",
  certification: "ISSA Certified, CrossFit Level 2",
  image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
  nextSession: "Tomorrow, 7:30 AM",
  totalSessions: 18,
  rating: 4.9,
  messages: [
    { from: "trainer", text: "Great work on the deadlifts today! Keep that form consistent.", time: "2h ago" },
    { from: "user", text: "Thanks! Should I increase the weight next session?", time: "1h ago" },
    { from: "trainer", text: "Yes, let's go up by 5kg. You're ready for it 💪", time: "45m ago" },
  ]
};

export const paymentHistory = [
  { id: "INV-2025-004", date: "Nov 15, 2024", plan: "Half-Yearly Plan", amount: "$179.00", status: "paid" },
  { id: "INV-2025-003", date: "May 15, 2024", plan: "Half-Yearly Plan", amount: "$179.00", status: "paid" },
  { id: "INV-2025-002", date: "Feb 15, 2024", plan: "Quarterly Plan", amount: "$99.00", status: "paid" },
  { id: "INV-2025-001", date: "Jan 1, 2024", plan: "Monthly Plan", amount: "$39.00", status: "paid" },
];
