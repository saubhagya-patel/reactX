import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * A main layout component that wraps every page.
 * It renders the persistent Navbar at the top and the
 * current page's content (via <Outlet />) below it.
 */
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8 pt-24">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;
