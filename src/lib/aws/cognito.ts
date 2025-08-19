import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { User } from '../../types';

// These would be your actual AWS Cognito pool configuration
const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || 'us-east-1_example',
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'example-client-id',
};

const userPool = new CognitoUserPool(poolData);

export const signIn = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        localStorage.setItem('accessToken', accessToken);
        
        // Mock user data - in real implementation, you'd get this from Cognito attributes
        const user: User = {
          id: result.getAccessToken().payload.sub,
          email,
          firstName: 'John',
          lastName: 'Doe',
          level: 5,
          rank: 'Intermediate',
          totalPoints: 1250,
          streak: 7,
          hoursLearned: 24,
          problemsSolved: 85,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        
        resolve(user);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      // In a real implementation, you might need email verification
      // For demo purposes, we'll create a mock user
      const user: User = {
        id: result?.userSub || 'new-user',
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

      resolve(user);
    });
  });
};

export const signOut = async (): Promise<void> => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
  localStorage.removeItem('accessToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        resolve(null);
        return;
      }

      // Mock user data - in real implementation, you'd get this from Cognito attributes
      const user: User = {
        id: session.getAccessToken().payload.sub,
        email: session.getAccessToken().payload.username || 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        level: 5,
        rank: 'Intermediate',
        totalPoints: 1250,
        streak: 7,
        hoursLearned: 24,
        problemsSolved: 85,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      resolve(user);
    });
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};