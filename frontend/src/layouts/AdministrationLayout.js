import React from 'react';
import { Outlet } from 'react-router-dom';
import AdministrationSidebar from '../components/AdministrationSidebar';


const AdministrationLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdministrationSidebar />
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdministrationLayout;
