import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      setLoading(false);
      return;
    }

    if (role === 'admin') {
      setUser({ email: localStorage.getItem('adminEmail') || 'admin@codersclub.edu.in', role: 'admin' });
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      setUser({ ...res.data.user, role: 'leader' });
      setTeam(res.data.team);
      setWhatsappGroupLink(res.data.whatsappGroupLink);
    } catch (err) {
      console.error('Session expired or invalid token');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loginLeader = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const role = res.data.role || 'leader';
    localStorage.setItem('role', role);

    if (role === 'admin') {
      localStorage.setItem('adminEmail', res.data.email);
      setUser({ email: res.data.email, role: 'admin' });
    } else {
      setUser({ _id: res.data._id, email: res.data.email, role: 'leader', teamId: res.data.teamId });
      setTeam(res.data.team);
    }
    return res.data;
  };

  const loginAdmin = async (email, password) => {
    const res = await API.post('/auth/admin-login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', 'admin');
    localStorage.setItem('adminEmail', res.data.email);
    setUser({ email: res.data.email, role: 'admin' });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminEmail');
    setUser(null);
    setTeam(null);
    setWhatsappGroupLink(null);
  };

  const setAuthDataAfterRegister = (token, userData, teamData, whatsappLink) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'leader');
    setUser({ ...userData, role: 'leader' });
    setTeam(teamData);
    setWhatsappGroupLink(whatsappLink);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        team,
        setTeam,
        whatsappGroupLink,
        loading,
        loginLeader,
        loginAdmin,
        logout,
        setAuthDataAfterRegister,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
