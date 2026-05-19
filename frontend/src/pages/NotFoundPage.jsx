// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <p className="text-8xl font-black text-indigo-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
