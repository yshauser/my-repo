//src/pages/Settings/SettingsPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../Users/AuthContext';
import { Pencil, Trash } from 'lucide-react';


interface User {
  id: number;
  username: string;
  role: 'owner' | 'admin' | 'user';
}

// const initialUsers: User[] = [
//   { id: 1, username: 'admin', role: 'admin' }
// ];

export const SettingsPage = () => {
  const { user, users, addUser: contextAddUser } = useAuth();
  const [newUser, setNewUser] = useState({ username: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (!user || user.role !== 'admin') {
    return <div>גישה נדחתה</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div>גישה נדחתה</div>;
  }

  const addUser = () => {
    if (!newUser.username.trim()) return;
  
    const userToAdd = { 
      username: newUser.username, 
      role: newUser.role as 'owner' | 'admin' | 'user'
    };

    contextAddUser(userToAdd);
    setNewUser({ username: '', role: 'user' }); // Reset input
  };


  const removeUser = (id: number) => {
    // setUsers(users.filter(user => user.id !== id));
  };

  const updateUserRole = (id: number, role: 'owner' | 'admin' | 'user') => {
    // setUsers(users.map(user => user.id === id ? { ...user, role } : user));
    // setEditingUser(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">ניהול משתמשים</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="שם משתמש"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="border p-2"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
          className="border p-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
        <button onClick={addUser} className="bg-blue-500 text-white p-2">הוסף</button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">שם</th>
            <th className="border p-2">תפקיד</th>
            <th className="border p-2">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ username, role }) => (
            <tr key={username} className="border">
              <td className="border p-2">{username}</td>
              <td className="border p-2">{role}</td>
              {username !== 'admin' && (
              <td className="border p-2">
                <div className="flex w-full h-full justify-center items-center gap-4 ">
                  <button onClick={() => console.log('Edit functionality to be implemented')}>
                    <Pencil size={16} className="text-blue-500" />
                  </button>
                  <button onClick={() => console.log('Remove functionality to be implemented')}>
                    <Trash size={16} className="text-red-500" />
                  </button>
                </div>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SettingsPage;
