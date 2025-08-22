import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  resetPassword,
  confirmResetPassword,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
} from "aws-amplify/auth";
import { User } from "../../types";

// Helper: Map Cognito user → App User
const mapCognitoUserToAppUser = (cognitoUser: any): User => {
  const attributes = cognitoUser?.signInDetails?.loginId
    ? cognitoUser.signInDetails
    : {};

  return {
    id: cognitoUser.userId || "",
    email: attributes.loginId || "",
    firstName: attributes.given_name || "John",
    lastName: attributes.family_name || "Doe",
    level: parseInt(attributes["custom:level"] || "1", 10),
    rank: attributes["custom:rank"] || "Beginner",
    totalPoints: parseInt(attributes["custom:totalPoints"] || "0", 10),
    streak: parseInt(attributes["custom:streak"] || "0", 10),
    hoursLearned: parseInt(attributes["custom:hoursLearned"] || "0", 10),
    problemsSolved: parseInt(attributes["custom:problemsSolved"] || "0", 10),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
};

// --- Auth functions --- //

// Sign In
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const { isSignedIn, nextStep } = await amplifySignIn({ username: email, password });

    if (!isSignedIn) {
      console.log("Next step required:", nextStep);
      throw new Error("User not fully signed in, more steps required.");
    }

    const user = await amplifyGetCurrentUser();
    return mapCognitoUserToAppUser(user);
  } catch (error) {
    console.error("Error signing in", error);
    throw error;
  }
};

// Sign Up
export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const { userId, nextStep } = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          given_name: firstName,
          family_name: lastName,
        },
      },
    });

    console.log("Sign up next step:", nextStep);

    if (!userId) {
      throw new Error("Sign up failed: userId missing.");
    }

    return {
      id: userId,
      email,
      firstName,
      lastName,
      level: 1,
      rank: "Beginner",
      totalPoints: 0,
      streak: 0,
      hoursLearned: 0,
      problemsSolved: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

// Sign Out
export const signOut = async (): Promise<void> => {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Get Current User
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cognitoUser = await amplifyGetCurrentUser();
    return mapCognitoUserToAppUser(cognitoUser);
  } catch {
    return null; // not signed in
  }
};

// Forgot Password (request code)
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await resetPassword({ username: email });
  } catch (error) {
    console.error("Error sending reset code", error);
    throw error;
  }
};

// Forgot Password (submit new password)
export const forgotPasswordSubmit = async (
  email: string,
  code: string,
  newPassword: string
): Promise<void> => {
  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  } catch (error) {
    console.error("Error resetting password", error);
    throw error;
  }
};

// Confirm Sign Up
export const confirmSignUp = async (email: string, code: string): Promise<void> => {
  try {
    await amplifyConfirmSignUp({ username: email, confirmationCode: code });
  } catch (error) {
    console.error("Error confirming sign up", error);
    throw error;
  }
};

// Resend Sign Up Code
export const resendSignUpCode = async (email: string): Promise<void> => {
  try {
    await amplifyResendSignUpCode({ username: email });
  } catch (error) {
    console.error("Error resending sign up code", error);
    throw error;
  }
};