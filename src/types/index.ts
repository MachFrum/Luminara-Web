export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  level: number;
  rank: string;
  totalPoints: number;
  streak: number;
  hoursLearned: number;
  problemsSolved: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface ProblemEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  submittedAt: string;
  solvedAt?: string;
  solution?: string;
  imageUrl?: string;
  status: 'pending' | 'solved' | 'failed';
}

export interface ProblemSubmissionData {
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  image?: File;
}

export interface ProblemResult {
  id: string;
  solution: string;
  explanation: string;
  confidence: number;
  processingTime: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface ActivityData {
  date: string;
  problemsSolved: number;
  hoursLearned: number;
  pointsEarned: number;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  text: string;
  textSecondary: string;
  textLight: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

export interface Typography {
  fontFamily: string;
  heading: {
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
  };
  subheading: {
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
  };
  body: {
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
  };
  caption: {
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export type ThemeMode = 'light' | 'dark';