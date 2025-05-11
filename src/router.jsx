// Import router components and page components
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import CountryDetail from './pages/CountryDetail';
import Favorites from './pages/Favorites';
import LiveTimer from "./pages/LiveTimer";

// Configure application routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/country/:code',
    element: <CountryDetail />,
  },
  {
    path: '/favorites',
    element: <Favorites />,
  },
  {
    path: '/live-timer',
    element: <LiveTimer />,
  },
], {
  // Enable future React Router features
  future: {
    v7_startTransition: true, // Enable concurrent features
    v7_relativeSplatPath: true, // Enable relative path handling
  },
});

// Router provider component for the application
export const AppRouter = () => <RouterProvider router={router} />; 