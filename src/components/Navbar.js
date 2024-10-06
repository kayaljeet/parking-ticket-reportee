"use client";

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Activity, Clock, LogOut, Menu, X } from 'react-feather';

export default function Navbar({ isOpen, setIsOpen }) {

  useEffect(() => {
    const handleResize = () => {
      // Check window size and set isOpen accordingly
      setIsOpen(window.innerWidth >= 768);
    };

    // Attach resize event listener
    window.addEventListener('resize', handleResize);

    // Call handleResize on mount to set initial state
    handleResize();

    // Cleanup the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-full"
        onClick={() => setIsOpen((prev) => !prev)} // Use functional update to toggle
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`
        bg-black text-white p-6
        fixed md:static
        h-full md:h-screen
        w-64 md:w-20 lg:w-64
        transition-all duration-300 ease-in-out
        ${isOpen ? 'left-0' : '-left-64'}
        z-50
      `}>
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <div className="w-16 h-16 bg-gray-600 rounded-full overflow-hidden">
              <img src="/user.jpg" alt="User" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-semibold md:hidden lg:block">Joe</h2>
          </div>
          <div className="space-y-2 flex-grow">
            <NavLink to="/map" className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`} onClick={() => setIsOpen(false)}>
              <MapPin className="h-5 w-5" />
              <span className="ml-3 md:hidden lg:inline">Map</span>
            </NavLink>
            <NavLink to="/active" className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`} onClick={() => setIsOpen(false)}>
              <Activity className="h-5 w-5" />
              <span className="ml-3 md:hidden lg:inline">Active</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`} onClick={() => setIsOpen(false)}>
              <Clock className="h-5 w-5" />
              <span className="ml-3 md:hidden lg:inline">History</span>
            </NavLink>
          </div>
          <button className="flex items-center p-2 rounded-lg hover:bg-gray-800 w-full justify-start mt-auto">
            <LogOut className="h-5 w-5" />
            <span className="ml-3 md:hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
