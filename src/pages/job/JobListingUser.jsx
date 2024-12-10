import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

function JobListingUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sortBy, setSortBy] = useState('date-newest');
  const [selectedOrganization, setSelectedOrganization] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sortBy, selectedOrganization, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/job-listings/job-listings/detailed', {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job listings');
      }

      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings.');
    }
  };

  const applyFilters = () => {
    let updatedJobs = [...jobs];

    // Filter by Organization
    if (selectedOrganization !== 'All') {
      updatedJobs = updatedJobs.filter(
        (job) => job.organization_name === selectedOrganization
      );
    }

    // Sort by Date
    if (sortBy === 'date-newest') {
      updatedJobs.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else if (sortBy === 'date-oldest') {
      updatedJobs.sort((a, b) => new Date(a.created) - new Date(b.created));
    }

    setFilteredJobs(updatedJobs);
  };

  const handleViewJob = (jobId) => {
    localStorage.setItem('check_job_listing_id', jobId);
    window.location.href = '/job/job-post';
  };

  // Get unique organization names for the filter dropdown
  const organizationNames = [
    'All',
    ...new Set(jobs.map((job) => job.organization_name)),
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Your Listings ✨</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4 mb-6">
              {/* Sort by Date */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Sort by</label>
                <select
                  className="form-select w-40"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-newest">Date: Newest</option>
                  <option value="date-oldest">Date: Oldest</option>
                </select>
              </div>

              {/* Filter by Organization */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Filter by Organization</label>
                <select
                  className="form-select w-60"
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                >
                  {organizationNames.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Jobs header */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-slate-500 italic">
                Showing {filteredJobs.length} Jobs
              </div>
            </div>

            {/* Jobs list */}
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const createdDate = new Date(job.created);
                  const formattedDate = `${createdDate.toLocaleString('default', {
                    month: 'short',
                  })} ${createdDate.getDate()}, ${createdDate.getFullYear()}`;

                  return (
                    <div
                      key={job.id}
                      className="p-4 border border-slate-200 rounded-lg shadow-sm flex items-center justify-between space-x-4"
                    >
                      {/* Organization Logo */}
                      <img
                        src={job.organization_logo}
                        alt={job.organization_name}
                        className="w-12 h-12 rounded-full border"
                      />

                      {/* Job Details */}
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-slate-800">
                          {job.job_role || 'Unknown Role'}
                          <span className="text-sm text-slate-500 italic"> - {formattedDate}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          {job.job_type} / {job.job_nature} / {job.salary_low} - {job.salary_high} USD
                        </div>
                        <div className="text-sm text-slate-500 italic">
                          {job.organization_name}
                        </div>
                      </div>

                      {/* View Job Button */}
                      <button
                        className="btn bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleViewJob(job.id)}
                      >
                        View Job
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-slate-500">No jobs found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobListingUser;
