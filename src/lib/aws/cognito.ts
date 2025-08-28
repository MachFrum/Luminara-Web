
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchUserAttributes,
  updateUserAttributes,
  resetPassword,
  confirmResetPassword,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
} from "aws-amplify/auth";
import { User } from "../../types";

// Helper: Map Cognito user attributes to the app's User type
const mapCognitoUserToAppUser = (userId: string, attributes: any): User => {
  const isProfileComplete = !!attributes.given_name &&
                            !!attributes.family_name &&
                            !!attributes.preferred_username &&
                            !!attributes["custom:age"];

  return {
    id: userId,
    email: attributes.email || "",
    firstName: attributes.given_name || "",
    lastName: attributes.family_name || "",
    middleName: attributes.middle_name || "",
    preferredUsername: attributes.preferred_username || "",
    age: attributes["custom:age"] ? parseInt(attributes["custom:age"], 10) : undefined,
    country: attributes["custom:country"] || "",
    language: attributes["custom:language"] || "",
    school: attributes["custom:school"] || "",
    grade: attributes["custom:grade"] || "",
    level: parseInt(attributes["custom:level"] || "1", 10),
    rank: attributes["custom:rank"] || "Beginner",
    totalPoints: parseInt(attributes["custom:totalPoints"] || "0", 10),
    streak: parseInt(attributes["custom:streak"] || "0", 10),
    hoursLearned: parseInt(attributes["custom:hoursLearned"] || "0", 10),
    problemsSolved: parseInt(attributes["custom:problemsSolved"] || "0", 10),
    createdAt: attributes.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isProfileComplete,
  };
};

// --- Auth functions --- //

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    if (typeof password !== 'string' || password === null || password === undefined) {
      throw new Error("Password must be a valid string for signIn.");
    }
    const { isSignedIn } = await amplifySignIn({ username: email, password });

    if (!isSignedIn) {
      throw new Error("User not fully signed in, more steps required.");
    }

    return await getCurrentUser() as User;
  } catch (error) {
    console.error("Error signing in", error);
    throw error;
  }
};

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<any> => {
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
    return { userId, nextStep };

  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cognitoUser = await amplifyGetCurrentUser();
    const attributes = await fetchUserAttributes();
    return mapCognitoUserToAppUser(cognitoUser.userId, attributes);
  } catch {
    return null; // not signed in
  }
};

export const updateCognitoUserAttributes = async (attributes: Partial<User>) => {
  try {
    const cognitoAttributes: { [key: string]: string } = {};
    if (attributes.firstName) cognitoAttributes.given_name = attributes.firstName;
    if (attributes.lastName) cognitoAttributes.family_name = attributes.lastName;
    if (attributes.middleName) cognitoAttributes.middle_name = attributes.middleName;
    if (attributes.preferredUsername) cognitoAttributes.preferred_username = attributes.preferredUsername;
    if (attributes.age) cognitoAttributes['custom:age'] = attributes.age.toString();
    if (attributes.country) cognitoAttributes['custom:country'] = attributes.country;
    if (attributes.language) cognitoAttributes['custom:language'] = attributes.language;
    if (attributes.school) cognitoAttributes['custom:school'] = attributes.school;
    if (attributes.grade) cognitoAttributes['custom:grade'] = attributes.grade;

    await updateUserAttributes({ userAttributes: cognitoAttributes });
  } catch (error) {
    console.error("Error updating user attributes", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await resetPassword({ username: email });
  } catch (error) {
    console.error("Error sending reset code", error);
    throw error;
  }
};

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

export const confirmSignUp = async (email: string, code: string): Promise<void> => {
  try {
    await amplifyConfirmSignUp({ username: email, confirmationCode: code });
  } catch (error) {
    console.error("Error confirming sign up", error);
    throw error;
  }
};

export const resendSignUpCode = async (email: string): Promise<void> => {
  try {
    await amplifyResendSignUpCode({ username: email });
  } catch (error) {
    console.error("Error resending sign up code", error);
    throw error;
  }
};