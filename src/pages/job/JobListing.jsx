import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

function JobListing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState({
    job_role: '',
    job_nature: 'Remote',
    job_type: 'Full-Time',
    immigration: 'Yes',
    salary_low: '',
    salary_high: '',
    apply_link: '',
    company_link: '',
    role_data: '',
    about_you: '',
    must_do: '',
  });
  const recId = localStorage.getItem('rec_id');
  const organizationId = localStorage.getItem('organization_id');

  useEffect(() => {
    fetchJobs();
  }, [recId]);

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

      // Filter jobs based on rec_id
      const filtered = data.filter((job) => job.organization_id === Number(organizationId));
      setFilteredJobs(filtered);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleJobDataChange = (key, value) => {
    setJobData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateJob = async () => {
    try {
      // API call to create a job
      const response = await fetch('http://127.0.0.1:8000/job-listings/job-listings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          organization_id: Number(organizationId),
          recruiter_id: Number(recId),
          job_type: jobData.job_type,
          salary_low: jobData.salary_low,
          salary_high: jobData.salary_high,
          immigration: jobData.immigration === 'Yes',
          apply_link: jobData.apply_link,
          job_nature: jobData.job_nature,
          job_role: jobData.job_role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const jobResponse = await response.json();
      const jobListingId = jobResponse.id;

      // Save job_listing_id in localStorage
      localStorage.setItem('job_listing_id', jobListingId);

      // API call to create job details
      const detailsResponse = await fetch('http://127.0.0.1:8000/job-details/job-details/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          job_listing_id: jobListingId,
          role_data: jobData.role_data,
          apply_link: jobData.apply_link,
          company_link: jobData.company_link,
          about_you: jobData.about_you,
          must_do: jobData.must_do,
        }),
      });

      if (!detailsResponse.ok) {
        throw new Error('Failed to create job details');
      }

      // Refresh job listings
      fetchJobs();

      // Close modal on success and show toast
      setIsModalOpen(false);
      toast.success('Job created successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  const handleViewJob = (jobId) => {
    localStorage.setItem('check_job_listing_id', jobId);
    window.location.href = '/job/job-post';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Your Listings ✨</h1>
              <button
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                onClick={() => setIsModalOpen(true)}
              >
                <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="hidden xs:block ml-2">Post A Job</span>
              </button>
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
                  })} ${createdDate.getDate()}`;

                  return (
                    <div
                      key={job.id}
                      className="p-4 border border-slate-200 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <div className="text-lg font-semibold text-slate-800">
                          {job.job_role} <span className="text-sm text-slate-500 italic">- {formattedDate}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          {job.job_type} / {job.job_nature}
                        </div>
                      </div>
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full overflow-y-auto max-h-screen">
              <div className="flex">
                {/* Left Section */}
                <div className="w-1/2 pr-4">
                  <h2 className="text-xl font-bold mb-4">Job Details</h2>
                  {['job_role', 'job_nature', 'job_type', 'immigration', 'salary_low', 'salary_high', 'apply_link', 'company_link'].map((key) => (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      {['job_nature', 'job_type', 'immigration'].includes(key) ? (
                        <select
                          className="form-select w-full"
                          value={jobData[key]}
                          onChange={(e) => handleJobDataChange(key, e.target.value)}
                        >
                          {key === 'job_nature' && ['Remote', 'Office', 'Hybrid'].map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                          {key === 'job_type' && ['Full-Time', 'Contract', 'Freelance'].map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                          {key === 'immigration' && ['Yes', 'No'].map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-input w-full"
                          value={jobData[key]}
                          onChange={(e) => handleJobDataChange(key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Section */}
                <div className="w-1/2 pl-4">
                  <h2 className="text-xl font-bold mb-4">Additional Information</h2>
                  {['role_data', 'about_you', 'must_do'].map((key) => (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {key.replace(/_/g, ' ')} (Max 500 words)
                      </label>
                      <textarea
                        rows="4"
                        className="form-textarea w-full"
                        value={jobData[key]}
                        onChange={(e) => handleJobDataChange(key, e.target.value)}
                        maxLength={500}
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        {jobData[key].split(/\s+/).filter(Boolean).length} / 500 words
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="btn bg-red-500 text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="btn bg-indigo-500 text-white"
                  onClick={handleCreateJob}
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListing;
