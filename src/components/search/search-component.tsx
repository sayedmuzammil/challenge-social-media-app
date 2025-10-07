import React from 'react';
import { Search } from 'lucide-react';

const SearchComponent = () => {
  return (
    <div>
      <div className="hidden md:flex h-12 bg-input border border-border rounded-full items-center px-3 w-[clamp(400px,60vw,800px)]">
        <Search />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-full bg-transparent outline-none px-4 rounded-full text-foreground"
        />
      </div>
      <div className="flex md:hidden w-full h-full  items-center px-3 ">
        <Search />
      </div>
    </div>
  );
};

export default SearchComponent;
