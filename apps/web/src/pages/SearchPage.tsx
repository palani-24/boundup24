import React from 'react';
import { SearchBar } from '../components/explore/SearchBar';

export const SearchPage: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-3 select-none">
      <h1 className="text-xl font-extrabold font-heading text-brand-text mb-4">Search BoundUp</h1>
      <SearchBar />
    </div>
  );
};
