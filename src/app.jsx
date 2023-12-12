// App.jsx

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Mainpage from './mainpage';

// Create a container element for your app
const appContainer = document.createElement('div');
appContainer.id = 'app-container'; // You can set any ID or class name

// Append the container to the document body
document.body.appendChild(appContainer);

// Use createRoot with the container as the root
const root = createRoot(appContainer);

// Render your app inside the root
root.render(<Mainpage />);