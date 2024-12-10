import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

function JobPost() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [jobListing, setJobListing] = useState(null);

  const jobListingId = localStorage.getItem('check_job_listing_id');
  const organizationId = localStorage.getItem('organization_id');

  useEffect(() => {
    fetchJobDetails();
    fetchCompanyInfo();
    fetchJobListing();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/job-details/job-details/${jobListingId}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch job details');
      const data = await response.json();
      setJobDetails(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/organizations/organizations/${organizationId}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch company info');
      const data = await response.json();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const fetchJobListing = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/job-listings/job-listings/${jobListingId}/detailed`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch job listing');
      const data = await response.json();
      setJobListing(data);
    } catch (error) {
      console.error('Error fetching job listing:', error);
    }
  };

  // Get the last_login value from localStorage
  const lastLogin = localStorage.getItem('last_login');

  // Determine the link destination based on the last_login value
  const linkTo = lastLogin === 'user' ? '/job/job-listing-user' : '/job/job-listing';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Page content */}
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
              {/* Content */}
              <div>
                <div className="mb-6">
                  <Link
                    className="btn-sm px-3 bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                    to={linkTo} // Dynamic link based on last_login
                  >
                    <svg
                      className="fill-current text-slate-400 mr-2"
                      width="7"
                      height="12"
                      viewBox="0 0 7 12"
                    >
                      <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
                    </svg>
                    <span>Back To Jobs</span>
                  </Link>
                </div>
                {jobListing && (
                  <div>
                    <div className="text-sm text-slate-500 italic mb-2">
                      Posted {new Date(jobListing.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <header className="mb-4">
                      {/* Title */}
                      <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">{jobListing.job_role}</h1>
                    </header>

                    {/* Tags */}
                    <div className="mb-6">
                      <div className="flex flex-wrap items-center -m-1">
                        <div className="m-1">
                          <span className="text-xs inline-flex font-medium bg-indigo-100 text-indigo-600 rounded-full text-center px-2.5 py-1">
                            {jobListing.job_type}
                          </span>
                        </div>
                        <div className="m-1">
                          <span className="text-xs inline-flex font-medium bg-indigo-100 text-indigo-600 rounded-full text-center px-2.5 py-1">
                            {jobListing.job_nature}
                          </span>
                        </div>
                        {jobListing.immigration && (
                          <div className="m-1">
                            <span className="text-xs inline-flex font-medium bg-green-100 text-green-600 rounded-full text-center px-2.5 py-1">
                              Visa Sponsorship
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* The Role */}
                {jobDetails && (
                  <div>
                    <h2 className="text-xl leading-snug text-slate-800 font-bold mb-2">The Role</h2>
                    <p>{jobDetails.role_data}</p>

                    <hr className="my-6 border-t border-slate-200" />

                    {/* About You */}
                    <h2 className="text-xl leading-snug text-slate-800 font-bold mb-2">About You</h2>
                    <p>{jobDetails.about_you}</p>

                    <hr className="my-6 border-t border-slate-200" />

                    {/* Things You Might Do */}
                    <h2 className="text-xl leading-snug text-slate-800 font-bold mb-2">Things You Might Do</h2>
                    <p>{jobDetails.must_do}</p>

                    <hr className="my-6 border-t border-slate-200" />

                    {/* Apply section */}
                    <button
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                      onClick={() => window.open(jobDetails.apply_link, '_blank')}
                    >
                      Apply Today -&gt;
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block space-y-4">
                {companyInfo && (
                  <div className="bg-white p-5 shadow-lg rounded-sm border border-slate-200 lg:w-72 xl:w-80">
                    <div className="text-center mb-6">
                      <div className="inline-flex mb-3">
                        <img
                          className="w-16 h-16 rounded-full"
                          src={companyInfo.logo_link}
                          alt={companyInfo.name}
                        />
                      </div>
                      <div className="text-lg font-bold text-slate-800 mb-1">{companyInfo.name}</div>
                      <div className="text-sm text-slate-500 italic">{companyInfo.location}</div>
                    </div>
                    <button
                      className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                      onClick={() => window.open(companyInfo.website, '_blank')}
                    >
                      Company Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobPost;
