import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OnboardingImage from '../images/onboarding-image.jpg';
import OnboardingDecoration from '../images/auth-decoration.png';

function Onboarding08() {
  const [orgId, setOrgId] = useState(null);
  const navigate = useNavigate();

  const handleGoToDashboard = async () => {
    try {
      // Retrieve organization details from localStorage
      const orgName = localStorage.getItem('org_name');
      const orgDescription = localStorage.getItem('about_organization');
      const orgLocation = localStorage.getItem('org_location');
      const orgWebsite = localStorage.getItem('org_websiteLink');
      const orgLogoLink = localStorage.getItem('org_logoImageUrl');

      if (!orgName || !orgDescription || !orgLocation || !orgWebsite || !orgLogoLink) {
        toast.error('Organization details are missing. Please complete onboarding.');
        return;
      }

      // API call to create organization
      const orgPayload = {
        name: orgName,
        description: orgDescription,
        location: orgLocation,
        website: orgWebsite,
        logo_link: orgLogoLink,
      };

      const orgResponse = await fetch('https://jsapi.sadabahaar.com/organizations/organizations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(orgPayload),
      });

      if (!orgResponse.ok) {
        throw new Error('Failed to create organization');
      }

      const orgData = await orgResponse.json();
      setOrgId(orgData.id);

      // Retrieve recruiter details from localStorage
      const recruiterName = localStorage.getItem('recruiter_name');
      const recruiterEmail = localStorage.getItem('recruiter_email');
      const recruiterPassword = localStorage.getItem('recruiter_password');

      if (!recruiterName || !recruiterEmail || !recruiterPassword) {
        toast.error('Recruiter details are missing. Please complete onboarding.');
        return;
      }

      // API call to create recruiter
      const recruiterPayload = {
        name: recruiterName,
        email: recruiterEmail,
        password: recruiterPassword,
        organization_id: orgData.id,
      };

      const recruiterResponse = await fetch('https://jsapi.sadabahaar.com/recruiters/recruiters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(recruiterPayload),
      });

      if (!recruiterResponse.ok) {
        throw new Error('Failed to create recruiter');
      }

      const recruiterData = await recruiterResponse.json();

      // Save organization_id and recruiter_id in localStorage
      localStorage.setItem('organization_id', orgData.id);
      localStorage.setItem('rec_id', recruiterData.id);

      // Clear the rest of the localStorage
      localStorage.removeItem('org_name');
      localStorage.removeItem('about_organization');
      localStorage.removeItem('org_location');
      localStorage.removeItem('org_websiteLink');
      localStorage.removeItem('org_logoImageUrl');
      localStorage.removeItem('recruiter_name');
      localStorage.removeItem('recruiter_email');
      localStorage.removeItem('recruiter_password');

      // Show success toast and navigate to the job listing page
      toast.success('Onboarding successful! Redirecting to job listing...');
      setTimeout(() => {
        navigate('/job/job-listing');
      }, 2000);
    } catch (error) {
      console.error('Error during onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
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

              <div className="px-4 pt-12 pb-8">
                <div className="max-w-md mx-auto w-full">
                  <div className="text-center">
                    <svg className="inline-flex w-16 h-16 fill-current mb-6" viewBox="0 0 64 64">
                      <circle className="text-emerald-100" cx="32" cy="32" r="32" />
                      <path className="text-emerald-500" d="m28.5 41-8-8 3-3 5 5 12-12 3 3z" />
                    </svg>
                    <h1 className="text-3xl text-slate-800 font-bold mb-8">Welcome! Your profile is ready 🙌</h1>
                    <button
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                      onClick={handleGoToDashboard}
                    >
                      Let's go! -&gt;
                    </button>
                  </div>
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

export default Onboarding08;
