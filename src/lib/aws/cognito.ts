import { Auth } from 'aws-amplify';
import { User } from '../../types';

// Helper function to map Cognito attributes to our User type
const mapCognitoUserToAppUser = (cognitoUser: any): User => {
  const attributes = cognitoUser.attributes;
  // NOTE: Once you set up your Cognito User Pool, make sure the custom attributes
  // like level, rank, totalPoints, etc., are defined and mapped correctly.
  return {
    id: attributes.sub,
    email: attributes.email,
    firstName: attributes.given_name || 'John',
    lastName: attributes.family_name || 'Doe',
    level: parseInt(attributes['custom:level'] || '1', 10),
    rank: attributes['custom:rank'] || 'Beginner',
    totalPoints: parseInt(attributes['custom:totalPoints'] || '0', 10),
    streak: parseInt(attributes['custom:streak'] || '0', 10),
    hoursLearned: parseInt(attributes['custom:hoursLearned'] || '0', 10),
    problemsSolved: parseInt(attributes['custom:problemsSolved'] || '0', 10),
    createdAt: attributes.created_at || new Date().toISOString(),
    lastLoginAt: attributes.last_login_at || new Date().toISOString(),
  };
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const cognitoUser = await Auth.signIn(email, password);
    return mapCognitoUserToAppUser(cognitoUser);
  } catch (error) {
    console.error('Error signing in', error);
    throw error;
  }
};

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        given_name: firstName,
        family_name: lastName,
        // You can add custom attributes here if they are defined in your User Pool
      },
    });
    // For this example, we'll return a mock user object after sign-up.
    // In a real app, you might need email verification before the user can sign in.
    return {
      id: user.userId,
      email,
      firstName,
      lastName,
      level: 1,
      rank: 'Beginner',
      totalPoints: 0,
      streak: 0,
      hoursLearned: 0,
      problemsSolved: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error signing up', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    return mapCognitoUserToAppUser(cognitoUser);
  } catch (error) {
    // Not signed in
    return null;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await Auth.forgotPassword(email);
  } catch (error) {
    console.error('Error sending password reset code', error);
    throw error;
  }
};

// Example of how to handle password reset completion
export const forgotPasswordSubmit = async (email: string, code: string, newPassword: string): Promise<void> => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    console.error('Error resetting password', error);
    throw error;
  }
};
