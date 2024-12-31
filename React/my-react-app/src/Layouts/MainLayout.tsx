// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { HomePage } from '../Pages/Home/HomePage'
import { LogPage } from '../Pages/Log/LogPage';
import { MedicinesPage } from '../Pages/Medicines/MedicinesPage';
import { KidsPage } from '../Pages/Kids/KidsPage';
import { LogEntry } from '../types';

export const MainLayout = () => {
  const [logData, setLogData] = useState<LogEntry[]>([]);
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto h-screen flex flex-col shadow-lg">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage logData={logData} setLogData={setLogData} />} />
          <Route path="/log" element={<LogPage logData={logData} setLogData={setLogData} />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/kids" element={<KidsPage />} />
        </Routes>
        <Navigation />
      </div>
    </div>
  );
};
