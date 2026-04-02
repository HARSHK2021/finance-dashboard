export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income'],
  expense: [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Utilities',
    'Housing',
    'Education',
    'Travel',
    'Subscriptions',
  ],
};

export const CATEGORY_ICONS = {
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Bonus: '🎁',
  'Other Income': '💰',
  'Food & Dining': '🍔',
  Transportation: '🚗',
  Entertainment: '🎮',
  Shopping: '🛒',
  Healthcare: '🏥',
  Utilities: '💡',
  Housing: '🏠',
  Education: '📚',
  Travel: '✈️',
  Subscriptions: '📱',
};

export const CATEGORY_COLORS = {
  'Food & Dining': '#f87171',
  Transportation: '#fb923c',
  Entertainment: '#a78bfa',
  Shopping: '#f472b6',
  Healthcare: '#34d399',
  Utilities: '#60a5fa',
  Housing: '#fbbf24',
  Education: '#4ade80',
  Travel: '#22d3ee',
  Subscriptions: '#818cf8',
  Salary: '#34d399',
  Freelance: '#22d3ee',
  Investment: '#a78bfa',
  Bonus: '#fbbf24',
  'Other Income': '#4ade80',
};

let txnIdCounter = 1;
const makeId = () => `txn_${String(txnIdCounter++).padStart(3, '0')}`;

export const initialTransactions = [
  // January 2024
  { id: makeId(), date: '2024-01-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-01-03', description: 'Grocery Run', category: 'Food & Dining', type: 'expense', amount: 142.80, merchant: 'Whole Foods' },
  { id: makeId(), date: '2024-01-05', description: 'Netflix Subscription', category: 'Subscriptions', type: 'expense', amount: 15.99, merchant: 'Netflix' },
  { id: makeId(), date: '2024-01-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1500, merchant: 'Greenwood Apartments' },
  { id: makeId(), date: '2024-01-09', description: 'Uber Rides', category: 'Transportation', type: 'expense', amount: 48.20, merchant: 'Uber' },
  { id: makeId(), date: '2024-01-12', description: 'Restaurant Dinner', category: 'Food & Dining', type: 'expense', amount: 87.50, merchant: 'The Olive Garden' },
  { id: makeId(), date: '2024-01-15', description: 'Freelance Project', category: 'Freelance', type: 'income', amount: 1200, merchant: 'Client - Startup Co.' },
  { id: makeId(), date: '2024-01-18', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 118.40, merchant: 'City Power Co.' },
  { id: makeId(), date: '2024-01-20', description: 'Amazon Shopping', category: 'Shopping', type: 'expense', amount: 234.99, merchant: 'Amazon' },
  { id: makeId(), date: '2024-01-22', description: 'Gym Membership', category: 'Subscriptions', type: 'expense', amount: 49, merchant: 'FitLife Gym' },
  { id: makeId(), date: '2024-01-25', description: 'Dividend Income', category: 'Investment', type: 'income', amount: 320, merchant: 'Vanguard Portfolio' },
  { id: makeId(), date: '2024-01-28', description: 'Doctor Checkup', category: 'Healthcare', type: 'expense', amount: 75, merchant: 'City Health Clinic' },

  // February 2024
  { id: makeId(), date: '2024-02-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-02-02', description: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', amount: 165.30, merchant: 'Trader Joes' },
  { id: makeId(), date: '2024-02-04', description: 'Spotify Premium', category: 'Subscriptions', type: 'expense', amount: 9.99, merchant: 'Spotify' },
  { id: makeId(), date: '2024-02-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1500, merchant: 'Greenwood Apartments' },
  { id: makeId(), date: '2024-02-10', description: 'Bus Pass', category: 'Transportation', type: 'expense', amount: 75, merchant: 'City Transit' },
  { id: makeId(), date: '2024-02-14', description: "Valentine's Dinner", category: 'Food & Dining', type: 'expense', amount: 148.70, merchant: 'La Maison' },
  { id: makeId(), date: '2024-02-16', description: 'Online Course', category: 'Education', type: 'expense', amount: 199, merchant: 'Udemy' },
  { id: makeId(), date: '2024-02-20', description: 'Gas & Electricity', category: 'Utilities', type: 'expense', amount: 135.60, merchant: 'National Grid' },
  { id: makeId(), date: '2024-02-22', description: 'Movie Night', category: 'Entertainment', type: 'expense', amount: 42.00, merchant: 'AMC Cinemas' },
  { id: makeId(), date: '2024-02-25', description: 'Freelance Design', category: 'Freelance', type: 'income', amount: 850, merchant: 'Client - Media Agency' },
  { id: makeId(), date: '2024-02-28', description: 'Pharmacy', category: 'Healthcare', type: 'expense', amount: 38.50, merchant: 'CVS Pharmacy' },

  // March 2024
  { id: makeId(), date: '2024-03-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-03-03', description: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', amount: 178.90, merchant: 'Whole Foods' },
  { id: makeId(), date: '2024-03-05', description: 'Performance Bonus', category: 'Bonus', type: 'income', amount: 1500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-03-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1500, merchant: 'Greenwood Apartments' },
  { id: makeId(), date: '2024-03-11', description: 'Car Service', category: 'Transportation', type: 'expense', amount: 185.00, merchant: 'AutoCare Plus' },
  { id: makeId(), date: '2024-03-14', description: 'Clothing Shopping', category: 'Shopping', type: 'expense', amount: 312.45, merchant: 'Zara' },
  { id: makeId(), date: '2024-03-18', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 89.99, merchant: 'Comcast' },
  { id: makeId(), date: '2024-03-20', description: 'Stock Dividend', category: 'Investment', type: 'income', amount: 480, merchant: 'Fidelity Portfolio' },
  { id: makeId(), date: '2024-03-22', description: 'Concert Tickets', category: 'Entertainment', type: 'expense', amount: 159.80, merchant: 'Ticketmaster' },
  { id: makeId(), date: '2024-03-26', description: 'Restaurant Lunch', category: 'Food & Dining', type: 'expense', amount: 54.30, merchant: 'Chipotle' },
  { id: makeId(), date: '2024-03-29', description: 'Health Insurance', category: 'Healthcare', type: 'expense', amount: 220, merchant: 'BlueCross' },

  // April 2024
  { id: makeId(), date: '2024-04-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-04-02', description: 'Weekly Groceries', category: 'Food & Dining', type: 'expense', amount: 195.60, merchant: 'Costco' },
  { id: makeId(), date: '2024-04-05', description: 'Adobe Creative Cloud', category: 'Subscriptions', type: 'expense', amount: 54.99, merchant: 'Adobe' },
  { id: makeId(), date: '2024-04-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1500, merchant: 'Greenwood Apartments' },
  { id: makeId(), date: '2024-04-10', description: 'Gas Station Fill', category: 'Transportation', type: 'expense', amount: 68.40, merchant: 'Shell' },
  { id: makeId(), date: '2024-04-13', description: 'Freelance Project', category: 'Freelance', type: 'income', amount: 2200, merchant: 'Client - E-Commerce Co.' },
  { id: makeId(), date: '2024-04-16', description: 'Weekend Getaway', category: 'Travel', type: 'expense', amount: 560.00, merchant: 'Airbnb' },
  { id: makeId(), date: '2024-04-19', description: 'Electric & Water', category: 'Utilities', type: 'expense', amount: 142.80, merchant: 'City Utilities' },
  { id: makeId(), date: '2024-04-22', description: 'Gaming Purchase', category: 'Entertainment', type: 'expense', amount: 79.99, merchant: 'Steam' },
  { id: makeId(), date: '2024-04-25', description: 'Books & Courses', category: 'Education', type: 'expense', amount: 89.00, merchant: 'Amazon Books' },
  { id: makeId(), date: '2024-04-28', description: 'New Shoes', category: 'Shopping', type: 'expense', amount: 142.00, merchant: 'Nike Store' },

  // May 2024
  { id: makeId(), date: '2024-05-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-05-03', description: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', amount: 211.40, merchant: 'Trader Joes' },
  { id: makeId(), date: '2024-05-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1500, merchant: 'Greenwood Apartments' },
  { id: makeId(), date: '2024-05-09', description: 'Uber & Lyft Rides', category: 'Transportation', type: 'expense', amount: 94.60, merchant: 'Uber / Lyft' },
  { id: makeId(), date: '2024-05-12', description: 'Investment Returns', category: 'Investment', type: 'income', amount: 680, merchant: 'Robinhood Portfolio' },
  { id: makeId(), date: '2024-05-15', description: 'Summer Clothing', category: 'Shopping', type: 'expense', amount: 275.80, merchant: 'H&M' },
  { id: makeId(), date: '2024-05-18', description: 'Utilities Bundle', category: 'Utilities', type: 'expense', amount: 158.90, merchant: 'Various Providers' },
  { id: makeId(), date: '2024-05-20', description: 'Restaurant Brunch', category: 'Food & Dining', type: 'expense', amount: 118.50, merchant: 'Sunday Brunch Co.' },
  { id: makeId(), date: '2024-05-23', description: 'Freelance Website', category: 'Freelance', type: 'income', amount: 1650, merchant: 'Client - Local Restaurant' },
  { id: makeId(), date: '2024-05-26', description: 'Dental Checkup', category: 'Healthcare', type: 'expense', amount: 180, merchant: 'Smile Dental' },
  { id: makeId(), date: '2024-05-29', description: 'Streaming Bundle', category: 'Subscriptions', type: 'expense', amount: 35.97, merchant: 'Disney+/Hulu/Max' },

  // June 2024
  { id: makeId(), date: '2024-06-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5500, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-06-04', description: 'Weekly Groceries', category: 'Food & Dining', type: 'expense', amount: 189.70, merchant: 'Whole Foods' },
  { id: makeId(), date: '2024-06-06', description: 'Summer Vacation Flight', category: 'Travel', type: 'expense', amount: 720.00, merchant: 'Delta Airlines' },
  { id: makeId(), date: '2024-06-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1500, merchant: 'Greenwood Apartments' },
  { id: makeId(), date: '2024-06-10', description: 'Mid-Year Bonus', category: 'Bonus', type: 'income', amount: 2000, merchant: 'TechCorp Inc.' },
  { id: makeId(), date: '2024-06-13', description: 'Fuel & Parking', category: 'Transportation', type: 'expense', amount: 112.30, merchant: 'Various' },
  { id: makeId(), date: '2024-06-17', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 174.20, merchant: 'City Power Co.' },
  { id: makeId(), date: '2024-06-20', description: 'Sports Equipment', category: 'Shopping', type: 'expense', amount: 388.00, merchant: 'REI' },
  { id: makeId(), date: '2024-06-23', description: 'Concert & Events', category: 'Entertainment', type: 'expense', amount: 210.00, merchant: 'Eventbrite' },
  { id: makeId(), date: '2024-06-26', description: 'Restaurant & Bars', category: 'Food & Dining', type: 'expense', amount: 234.80, merchant: 'Various Venues' },
  { id: makeId(), date: '2024-06-29', description: 'Freelance Bonus', category: 'Freelance', type: 'income', amount: 900, merchant: 'Client - TechCorp' },
];

export const MONTHLY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
