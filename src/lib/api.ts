import { ProblemEntry, ProblemSubmissionData, ProblemResult, Achievement, ActivityData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.luminara.com';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status
    );
  }
  return response.json();
};

// Problem-related API calls
export const submitProblem = async (data: ProblemSubmissionData): Promise<ProblemResult> => {
  const response = await fetch(`${API_BASE_URL}/problems/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ProblemResult>(response);
};

export const getProblemHistory = async (): Promise<ProblemEntry[]> => {
  // Mock data for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          userId: 'user1',
          title: 'Quadratic Equation Solution',
          description: 'Solve x² + 5x + 6 = 0',
          subject: 'Mathematics',
          difficulty: 'medium',
          tags: ['algebra', 'equations'],
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          solvedAt: new Date(Date.now() - 86000000).toISOString(),
          solution: 'x = -2 or x = -3',
          status: 'solved',
        },
        {
          id: '2',
          userId: 'user1',
          title: 'Chemical Balancing',
          description: 'Balance the equation: H₂ + O₂ → H₂O',
          subject: 'Chemistry',
          difficulty: 'easy',
          tags: ['balancing', 'reactions'],
          submittedAt: new Date(Date.now() - 172800000).toISOString(),
          solvedAt: new Date(Date.now() - 172000000).toISOString(),
          solution: '2H₂ + O₂ → 2H₂O',
          status: 'solved',
        },
      ]);
    }, 500);
  });
};

export const getProblemById = async (id: string): Promise<ProblemEntry> => {
  const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<ProblemEntry>(response);
};

// Achievement-related API calls
export const getAchievements = async (): Promise<Achievement[]> => {
  // Mock data for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'First Steps',
          description: 'Solve your first problem',
          icon: 'trophy',
          unlockedAt: new Date(Date.now() - 86400000).toISOString(),
          progress: 1,
          maxProgress: 1,
        },
        {
          id: '2',
          title: 'Problem Solver',
          description: 'Solve 10 problems',
          icon: 'target',
          progress: 8,
          maxProgress: 10,
        },
        {
          id: '3',
          title: 'Streak Master',
          description: 'Maintain a 7-day streak',
          icon: 'flame',
          unlockedAt: new Date(Date.now() - 3600000).toISOString(),
          progress: 7,
          maxProgress: 7,
        },
      ]);
    }, 300);
  });
};

// Activity data
export const getActivityData = async (period: 'week' | 'month'): Promise<ActivityData[]> => {
  // Mock data for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [];
      const days = period === 'week' ? 7 : 30;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          problemsSolved: Math.floor(Math.random() * 5) + 1,
          hoursLearned: Math.floor(Math.random() * 3) + 0.5,
          pointsEarned: Math.floor(Math.random() * 100) + 20,
        });
      }
      
      resolve(data);
    }, 400);
  });
};