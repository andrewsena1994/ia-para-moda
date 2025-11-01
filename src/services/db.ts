// This is a mock database service using localStorage.
// In a real application, this would be replaced with actual API calls to a backend.

const DB_KEY = 'fashion_ia_users';

interface UserData {
  password?: string;
  credits: number;
  isSubscribed: boolean;
}

const getAllUsers = (): Record<string, UserData> => {
  try {
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : {};
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return {};
  }
};

export const db_getUser = (email: string): UserData | undefined => {
  const users = getAllUsers();
  return users[email.toLowerCase()];
};

export const db_saveUser = (email: string, data: Partial<UserData>) => {
  const users = getAllUsers();
  const lowercasedEmail = email.toLowerCase();
  
  const existingData = users[lowercasedEmail] || {};

  // Fix: Cast the merged object to UserData. The application logic ensures
  // that this operation results in a valid UserData object, either by creating
  // a new user with all required fields or by updating an existing one.
  users[lowercasedEmail] = { ...existingData, ...data } as UserData;
  
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage", error);
  }
};
