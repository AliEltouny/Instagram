'use client';

import { useState, useEffect } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleInputChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const label = input.nextElementSibling as HTMLLabelElement;
      if (label) {
        if (input.value) {
          label.style.top = '3px';
          label.style.transform = 'none';
          label.style.fontSize = '10px';
        } else {
          label.style.top = '50%';
          label.style.transform = 'translateY(-50%)';
          label.style.fontSize = '12px';
        }
      }
    };

    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(input => {
      input.addEventListener('input', handleInputChange);
      if ((input as HTMLInputElement).value) {
        handleInputChange({ target: input } as unknown as Event);
      }
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('input', handleInputChange);
      });
    };
  }, []);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder=" "
          required
        />
        <label htmlFor="username">
          Phone number, username, or email
        </label>
      </div>
      
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=" "
          required
        />
        <label htmlFor="password">
          Password
        </label>
        {password && (
          <button 
            type="button" 
            className="show-hide-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="login-btn"
        disabled={!username || !password || isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}