import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OnboardingImage from '../images/onboarding-image.jpg';
import OnboardingDecoration from '../images/auth-decoration.png';

function Onboarding03() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const navigate = useNavigate();

  const countWords = (text) => text.trim().split(/\s+/).filter((word) => word).length;

  const uploadImage = async (file, setImageUrl, folder) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/users/upload-image/?folder=${folder}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
  
      const data = await response.json();
      setImageUrl(data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };
  

  const handleNextStep = () => {
    if (!currentLocation || !bio || !linkedinLink || !profileImageUrl || !coverImageUrl) {
      toast.error('Please fill in all fields before proceeding.');
      return;
    }

    if (countWords(bio) > 30) {
      toast.error('Bio must not exceed 30 words.');
      return;
    }

    const userData = {
      currentLocation,
      bio,
      linkedinLink,
      profileImageUrl,
      coverImageUrl,
    };

    localStorage.setItem('user_data', JSON.stringify(userData));
    navigate('/onboarding-04');
  };

  return (
    <main className="bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="relative flex">
        {/* Content */}
        <div className="w-full md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
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
                </Link>
                <div className="text-sm">
                  Have an account? <Link className="font-medium text-indigo-500 hover:text-indigo-600" to="/signin">Sign In</Link>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-4 pt-12 pb-8">
                <div className="max-w-md mx-auto w-full">
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200" aria-hidden="true"></div>
                    <ul className="relative flex justify-between w-full">
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white" to="/onboarding-01">1</Link>
                      </li>
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white" to="/onboarding-02">2</Link>
                      </li>
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white" to="/onboarding-03">3</Link>
                      </li>
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-100 text-slate-500" to="/onboarding-04">4</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-8">
              <div className="max-w-md mx-auto">

                <h1 className="text-3xl text-slate-800 font-bold mb-6">Tell us more about yourself ✨</h1>
                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Location <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter your current location"
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      className="form-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio <span className="text-rose-500">*</span></label>
                    <textarea
                      placeholder="Write a short bio (max 30 words)"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="form-textarea w-full"
                    ></textarea>
                    <p className={`text-sm mt-1 ${countWords(bio) > 30 ? 'text-red-500' : 'text-gray-500'}`}>
                      {countWords(bio)} / 30 words
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn Profile <span className="text-rose-500">*</span></label>
                    <input
                      type="url"
                      placeholder="Enter your LinkedIn profile URL"
                      value={linkedinLink}
                      onChange={(e) => setLinkedinLink(e.target.value)}
                      className="form-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile Photo <span className="text-rose-500">*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e.target.files[0], setProfileImageUrl)}
                      className="form-input w-full"
                    />
                    {profileImageUrl && <img src={profileImageUrl} alt="Profile Preview" className="mt-4 w-24 h-24 rounded-full object-cover" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cover Photo <span className="text-rose-500">*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e.target.files[0], setCoverImageUrl)}
                      className="form-input w-full"
                    />
                    {coverImageUrl && <img src={coverImageUrl} alt="Cover Preview" className="mt-4 w-full h-32 object-cover rounded-md" />}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <Link className="text-sm underline hover:no-underline" to="/onboarding-02">&lt;- Back</Link>
                  <button
                    type="button"
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={handleNextStep}
                  >
                    Next Step -&gt;
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={OnboardingImage} width="760" height="1024" alt="Onboarding" />
          <img className="absolute top-1/4 left-0 transform -translate-x-1/2 ml-8 hidden lg:block" src={OnboardingDecoration} width="218" height="224" alt="Authentication decoration" />
        </div>

      </div>

    </main>
  );
}

export default Onboarding03;
