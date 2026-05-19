// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { TrendingUp } from 'lucide-react';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password)) {
      e.password = 'Password must include uppercase, lowercase, number and special char';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const { data } = await authService.register(form);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-900/50">
            <TrendingUp size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Get started</h1>
          <p className="text-slate-400 mt-1">Create your free FinTrack account</p>
        </div>

        <div className="glass-panel rounded-3xl shadow-2xl p-8">
          <Alert type="error" message={serverError} className="mb-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="reg-name"
              type="text"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              id="reg-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              id="reg-password"
              type="password"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              placeholder="At least 6 characters"
            />
            <Button type="submit" variant="primary" className="w-full !py-3" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
