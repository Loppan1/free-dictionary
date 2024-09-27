import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Search from './components/Search/Search';

const container = document.getElementById('root');
const root = createRoot(container!); 
root.render(
  <React.StrictMode>
    <div className='wrapper'>
        <h1>Free Dictionary</h1>
        <Search />
    </div>
  </React.StrictMode>
);