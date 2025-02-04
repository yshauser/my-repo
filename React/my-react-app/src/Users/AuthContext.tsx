import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  username: string;
  role: 'owner' | 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string) => {success: boolean, message?: string};
  logout: () => void;
  addUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({ username: 'admin', role: 'admin' });
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers):[{username:'admin', role: 'admin'}]
  });

  // Persist users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lastUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('lastUser');
    }
  }, [user]);
  
  const login = (username: string): {success: boolean, message?:string} => {
    // Find user by username
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
      return {success:true};
    }
    
    return {
      success: false,
      message: 'משתמש לא נמצא'
    };
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (newUser: User) => {
    // Prevent duplicate usernames
    if (!users.some(u => u.username === newUser.username)) {
      setUsers([...users, newUser]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
