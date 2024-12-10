import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import OnboardingImage from '../images/onboarding-image.jpg';
import OnboardingDecoration from '../images/auth-decoration.png';

function Onboarding02() {
  const [workHistory, setWorkHistory] = useState([
    { companyName: '', role: '', location: '', startDate: '', endDate: '' },
  ]);

  const navigate = useNavigate();

  const handleAddWorkHistory = () => {
    setWorkHistory([
      ...workHistory,
      { companyName: '', role: '', location: '', startDate: '', endDate: '' },
    ]);
  };

  const handleWorkHistoryChange = (index, field, value) => {
    const updatedWorkHistory = [...workHistory];
    updatedWorkHistory[index][field] = value;
    setWorkHistory(updatedWorkHistory);
  };

  const handleCurrentWorkToggle = (index, isChecked) => {
    const updatedWorkHistory = [...workHistory];
    updatedWorkHistory[index].endDate = isChecked ? 'Present' : '';
    setWorkHistory(updatedWorkHistory);
  };

  const handleNextStep = () => {
    localStorage.setItem('work_history', JSON.stringify(workHistory));
    navigate('/onboarding-03');
  };

  return (
    <main className="bg-white">
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
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-100 text-slate-500" to="/onboarding-03">3</Link>
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
                <h1 className="text-3xl text-slate-800 font-bold mb-6">Tell us about your work history ✨</h1>
                {/* Work History Form */}
                {workHistory.map((work, index) => (
                  <div key={index} className="mb-6 border p-4 rounded-md">
                    <h2 className="font-semibold text-lg mb-4">Work History {index + 1}</h2>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={work.companyName}
                        onChange={(e) => handleWorkHistoryChange(index, 'companyName', e.target.value)}
                        className="form-input w-full"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={work.role}
                        onChange={(e) => handleWorkHistoryChange(index, 'role', e.target.value)}
                        className="form-input w-full"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={work.location}
                        onChange={(e) => handleWorkHistoryChange(index, 'location', e.target.value)}
                        className="form-input w-full"
                      />
                      <input
                        type="date"
                        placeholder="Start Date"
                        value={work.startDate}
                        onChange={(e) => handleWorkHistoryChange(index, 'startDate', e.target.value)}
                        className="form-input w-full"
                      />
                      {work.endDate === 'Present' ? (
                        <input
                          type="text"
                          placeholder="End Date"
                          value="Present"
                          disabled
                          className="form-input w-full bg-gray-100"
                        />
                      ) : (
                        <input
                          type="date"
                          placeholder="End Date"
                          value={work.endDate}
                          onChange={(e) => handleWorkHistoryChange(index, 'endDate', e.target.value)}
                          className="form-input w-full"
                        />
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-work-${index}`}
                          checked={work.endDate === 'Present'}
                          onChange={(e) => handleCurrentWorkToggle(index, e.target.checked)}
                        />
                        <label htmlFor={`current-work-${index}`} className="text-sm">I currently work here</label>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddWorkHistory}
                  className="btn bg-gray-200 hover:bg-gray-300 text-slate-800 w-full mb-6"
                >
                  + Add Another Work History
                </button>
                <div className="flex items-center justify-between">
                  <Link className="text-sm underline hover:no-underline" to="/onboarding-01">&lt;- Back</Link>
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

export default Onboarding02;
