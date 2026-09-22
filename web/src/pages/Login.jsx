import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [driverId, setDriverId] = useState('DRIVER001');
  const [pin, setPin] = useState('1234');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 'var(--radius-lg)',
            background: 'var(--primary)', color: 'white',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Leaf size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>FarmTrace</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Smart Farm-to-Fork Traceability
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 20 }}>Driver Login</h2>

          <form onSubmit={handleLogin}>
            <div className="form-group mb-16">
              <label className="form-label" htmlFor="driverId">Driver ID</label>
              <input
                id="driverId"
                className="form-input"
                type="text"
                value={driverId}
                onChange={e => setDriverId(e.target.value)}
                placeholder="Enter your driver ID"
              />
            </div>

            <div className="form-group mb-20">
              <label className="form-label" htmlFor="pin">PIN / Password</label>
              <input
                id="pin"
                className="form-input"
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter your PIN"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Login
            </button>
          </form>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 16 }}>
            Demo credentials: DRIVER001 / 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
