import React from 'react';

import './App.css';
import PostsList from './components/PostsList/PostsList';

function App() {
  return (
    <div className='Container'>
      <div className='Main'>
        <div className='Content'>
          <PostsList />
        </div>
      </div>
    </div>
  );
}

export default App;
