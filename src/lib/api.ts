
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import { ProblemEntry, ProblemResult, Achievement, ActivityData } from '../types';

const client = generateClient();

// Example GraphQL queries (these would be in src/graphql/queries.ts, etc.)
const listProblems = `query ListProblems { listProblems { items { id title ... } } }`;
const getProblem = `query GetProblem($id: ID!) { getProblem(id: $id) { id title ... } }`;
const createProblem = `mutation CreateProblem($input: CreateProblemInput!) { createProblem(input: $input) { id ... } }`;
const queryUserProgress = `query GetUserProgress { getUserProgress { stats { ... } achievements { ... } } }`;

// --- API Layer ---

// --- Problem-related API calls ---

export const submitProblem = async (data: { text: string; file?: File }): Promise<any> => {
  console.log('Submitting problem:', data);
  try {
    let fileKey: string | undefined = undefined;

    if (data.file) {
      const extension = data.file.name.split('.').pop();
      const key = `uploads/${uuidv4()}.${extension}`;
      
      const uploadTask = uploadData({
        path: `public/${key}`,
        data: data.file,
        options: {
          contentType: data.file.type,
        }
      });

      const result = await uploadTask.result;
      fileKey = result.path; // In v6, this is the full path
      console.log('File uploaded successfully:', fileKey);
    }

    const problemInput = {
      description: data.text,
      fileKey: fileKey,
      // Other fields like title, subject etc. would be extracted by the backend
    };

    // We are assuming the mutation is called 'createProblem' and it accepts this input.
    // This will likely fail until the backend is updated, but the offline logic will catch it.
    const result = await client.graphql({
      query: createProblem,
      variables: { input: problemInput }
    });
    
    // @ts-ignore
    console.log('GraphQL submission result:', result.data.createProblem);
    // @ts-ignore
    return result.data.createProblem;

  } catch (error) {
    console.error('Error submitting problem:', error);
    // Re-throw the error so the calling component knows the submission failed
    // and can trigger the offline caching mechanism.
    throw error;
  }
};

export const getProblemHistory = async (): Promise<ProblemEntry[]> => {
  // Example for a GraphQL API
  /*
  try {
    const problemData = await client.graphql({ query: listProblems });
    // @ts-ignore
    return problemData.data.listProblems.items;
  } catch (error) {
    console.error('Error fetching problem history', error);
    return [];
  }
  */
  return []; // Return empty array by default
};

export const getProblemById = async (id: string): Promise<ProblemEntry> => {
  // Example for a REST API
  /*
  try {
    const result = await API.get('luminaraApi', `/problems/${id}`, {});
    return result;
  } catch (error) {
    console.error(`Error fetching problem ${id}`, error);
    throw new Error('Failed to fetch problem');
  }
  */
  throw new Error('getProblemById is not implemented');
};

// --- User Progress and Achievement API calls ---

export const getAchievements = async (): Promise<Achievement[]> => {
  // This would also be an API call in a real application
  /*
  try {
    const achievementData = await client.graphql({ query: queries.listAchievements });
    return achievementData.data.listAchievements.items;
  } catch (error) {
    console.error('Error fetching achievements', error);
    return [];
  }
  */
  return [];
};

export const getActivityData = async (period: 'week' | 'month'): Promise<ActivityData[]> => {
  // This would also be an API call
  /*
  try {
    const activityData = await API.get('luminaraApi', `/activity/${period}`, {});
    return activityData;
  } catch (error) {
    console.error('Error fetching activity data', error);
    return [];
  }
  */
  return [];
};

export const setGoal = async (/*goalData: any*/): Promise<any> => {
//   try {
//     const response = await API.post('luminaraApi', '/goals', { body: goalData });
//     return response;
//   } catch (error) {
//     console.error('Error setting goal', error);
//     throw error;
//   }
};

export const getUserProgress = async (): Promise<any> => {
  // This function should fetch all data needed for the Progress Page.
  // Once your backend is ready, replace this mock data with a real API call.
  /*
  try {
    const response = await client.graphql({ query: queryUserProgress });
    return response.data.getUserProgress;
  } catch (error) {
    console.error('Error fetching user progress', error);
    throw error;
  }
  */

  // Return empty data structure to prevent crashes during development
  return Promise.resolve({
    stats: { challengesSolved: 0, topicsLearned: 0, goalsDone: 0, totalPoints: 0, level: 1, rank: 'Beginner' },
    activities: [],
    subjects: [],
    achievements: [],
    goals: [],
  });
};

export const getDashboardData = async (): Promise<any> => {
  // This function should fetch all data needed for the Dashboard Page.
  // Once your backend is ready, replace this mock data with a real API call.
  
  // Mock data to allow the Dashboard to render during development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recentProblems: [
          {
            id: '1',
            title: 'Quadratic Equation Solution',
            subject: 'Mathematics',
            difficulty: 'medium',
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            title: 'Chemical Balancing',
            subject: 'Chemistry',
            difficulty: 'easy',
            submittedAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
        achievements: [
          {
            id: '1',
            title: 'First Steps',
            progress: 1,
            maxProgress: 1,
            unlockedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            title: 'Problem Solver',
            progress: 8,
            maxProgress: 10,
          },
        ],
      });
    }, 300);
  });
};