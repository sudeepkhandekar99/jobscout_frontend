import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthImage from '../images/auth-image.jpg';
import AuthDecoration from '../images/auth-decoration.png';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOrganization, setIsOrganization] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Clear local storage before setting new data
    localStorage.clear();

    // Determine the API endpoint based on the "isOrganization" checkbox
    const endpoint = isOrganization
      ? 'https://jsapi.sadabahaar.com/auth/auth/sign-in-org'
      : 'https://jsapi.sadabahaar.com/auth/auth/sign-in';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();

      if (isOrganization) {
        // Save organization-related data
        localStorage.setItem('rec_id', data.recruiter_id);
        localStorage.setItem('recruiter_id', data.recruiter_id);
        localStorage.setItem('organization_id', data.organization_id);
        localStorage.setItem('last_login', 'recruiter');
      } else {
        // Save user_id for regular users
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('last_login', 'user');
      }

      // Display success toast
      toast.success('Sign-in successful!', {
        position: toast.POSITION.TOP_RIGHT,
      });

      // Redirect based on user type
      setTimeout(() => {
        if (isOrganization) {
          navigate('/job/job-listing');
        } else {
          navigate('/community/profile');
        }
      }, 2000);
    } catch (error) {
      console.error('Error signing in:', error);

      // Display error toast
      toast.error('Failed to sign in. Please check your credentials.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      navigate('/signup');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <main className="bg-white">
      <ToastContainer />

      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <a className="block" href="/">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                        <stop stopColor="#A5B4FC" offset="100%" />
                      </linearGradient>
                      <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                        <stop stopColor="#38BDF8" offset="100%" />
                      </linearGradient>
                    </defs>
                    <rect fill="#6366F1" width="32" height="32" rx="16" />
                    <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
                    <path d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z" fill="url(#logo-a)" />
                    <path d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z" fill="url(#logo-b)" />
                  </svg>
                </a>
                <form onSubmit={handleSignUp}>
                  <div className="">
                    <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3" type="submit">
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="max-w-sm mx-auto px-4 py-8">
              <h1 className="text-3xl text-slate-800 font-bold mb-6">Welcome back! ✨</h1>
              {/* Form */}
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      className="form-input w-full"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input
                      id="password"
                      className="form-input w-full"
                      type="password"
                      autoComplete="on"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      id="isOrganization"
                      type="checkbox"
                      className="form-checkbox"
                      checked={isOrganization}
                      onChange={(e) => setIsOrganization(e.target.checked)}
                    />
                    <label htmlFor="isOrganization" className="ml-2 text-sm">
                      Sign In as an organization
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3" type="submit">
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img
            className="object-cover object-center w-full h-full"
            src={AuthImage}
            width="760"
            height="1024"
            alt="Authentication"
          />
          <img
            className="absolute top-1/4 left-0 transform -translate-x-1/2 ml-8 hidden lg:block"
            src={AuthDecoration}
            width="218"
            height="224"
            alt="Authentication decoration"
          />
        </div>
      </div>
    </main>
  );
}

export default Signin;
