import Navbar from '@/components/navbar/navbar';
import Feed from '@/features/feed/feed';
import UserAuthContent from '@/components/user/user-auth-content';
import React from 'react';

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <div className="mx-auto p-6 w-full md:max-w-150 md:my-10 flex items-center justify-start">
        <Feed />
      </div>
    </div>
  );
};

export default Homepage;
