import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password, role: 'customer' });
      }
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold text-stone-900">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
      <form onSubmit={submit} className="glass-panel mt-6 space-y-4 rounded-2xl p-6">
        {mode === 'register' && (
          <input
            className="input-brand"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        )}
        <input
          className="input-brand"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <input
          className="input-brand"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
        />
        <button type="submit" className="btn-primary w-full rounded-full px-6 py-3">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
        className="mt-4 text-sm text-stone-600 hover:text-[#F77F00]"
      >
        {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
      </button>
      {message && <p className="mt-4 text-stone-700">{message}</p>}
    </main>
  );
}
