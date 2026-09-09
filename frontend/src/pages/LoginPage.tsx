import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ email, password });
      login(res.data);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
    }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '64px',
        color: 'white'
      }} className="hide-mobile">
        <div style={{ fontSize: '56px', marginBottom: '24px' }}>🎟️</div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', lineHeight: '1.2' }}>
          Your gateway to<br/>unforgettable events
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.8, maxWidth: '380px' }}>
          Discover concerts, conferences, and experiences. Book tickets in seconds.
        </p>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8fafc', padding: '24px'
      }}>
        <div style={{
          background: 'white', padding: '48px', borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)', width: '100%', maxWidth: '420px'
        }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '4px', color: '#1e293b' }}>
            Welcome back
          </h2>
          <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '14px' }}>
            Log in to manage your tickets
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
              borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
              border: '1px solid #fecaca'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                Email address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: '10px', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: '10px', fontSize: '14px', outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', fontSize: '15px', fontWeight: 700,
              color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
            }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
