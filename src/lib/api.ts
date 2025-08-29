
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import { User, ProblemEntry, ProblemResult, Achievement, ActivityData, ChallengeData } from '../types';
import { updateCognitoUserAttributes } from './aws/cognito';

const client = generateClient();

// Example GraphQL queries (these would be in src/graphql/queries.ts, etc.)
const listProblems = `query ListProblems { listProblems { items { id title ... } } }`;
const getProblem = `query GetProblem($id: ID!) { getProblem(id: $id) { id title ... } }`;
const createProblem = `mutation CreateProblem($input: CreateProblemInput!) { createProblem(input: $input) { id ... } }`;
const createChallenge = `mutation CreateChallenge($input: CreateChallengeInput!) { createChallenge(input: $input) { id ... } }`;
const updateUser = `mutation UpdateUser($input: UpdateUserInput!) { updateUser(input: $input) { id ... } }`;
const queryUserProgress = `query GetUserProgress { getUserProgress { stats { ... } achievements { ... } } }`;

// --- API Layer ---

// --- User Profile API calls ---
export const updateUserProfile = async (profileData: Partial<User>): Promise<void> => {
  console.log('Updating user profile:', profileData);
  try {
    // Step 1: Update attributes in Cognito
    await updateCognitoUserAttributes(profileData);

    // Step 2: Update user data in the backend database (e.g., DynamoDB via AppSync)
    // This assumes your backend has a corresponding 'updateUser' mutation.
    const result = await client.graphql({
      query: updateUser,
      variables: { input: profileData }
    });
    console.log('User profile updated in backend:', result);

  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};


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
    };

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
    throw error;
  }
};

export const getProblemHistory = async (): Promise<ProblemEntry[]> => {
  return []; // Return empty array by default
};

export const getProblemById = async (id: string): Promise<ProblemEntry> => {
  throw new Error('getProblemById is not implemented');
};

// --- Challenge-related API calls ---

export const startChallenge = async (challengeData: ChallengeData): Promise<any> => {
  console.log('Starting challenge:', challengeData);
  try {
    const result = await client.graphql({
      query: createChallenge,
      variables: { input: challengeData }
    });
    // @ts-ignore
    console.log('Challenge submission result:', result.data.createChallenge);
    // @ts-ignore
    return result.data.createChallenge;
  } catch (error) {
    console.error('Error starting challenge:', error);
    throw error;
  }
};


// --- User Progress and Achievement API calls ---

export const getAchievements = async (): Promise<Achievement[]> => {
  return [];
};

export const getActivityData = async (period: 'week' | 'month'): Promise<ActivityData[]> => {
  return [];
};

export const setGoal = async (/*goalData: any*/): Promise<any> => {
  // Not implemented
};

export const getUserProgress = async (): Promise<any> => {
  return Promise.resolve({
    stats: { challengesSolved: 0, topicsLearned: 0, goalsDone: 0, totalPoints: 0, level: 1, rank: 'Beginner' },
    activities: [],
    subjects: [],
    achievements: [],
    goals: [],
  });
};

export const getDashboardData = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recentProblems: [
          {
            id: '1',
            title: 'Quadratic Equation Solution',
            subject: 'Mathematics',
            difficulty: 'medium',
          },
          {
            id: '2',
            title: 'Chemical Balancing',
            subject: 'Chemistry',
            difficulty: 'easy',
          },
        ],
        achievements: [
          {
            id: '1',
            title: 'First Steps',
            progress: 1,
            maxProgress: 1,
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