import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MessagesBody() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumeHistory, setResumeHistory] = useState([]);

  useEffect(() => {
    // Load resume history and recommendations from local storage on component mount
    const storedHistory = JSON.parse(localStorage.getItem('resumeHistory')) || [];
    const storedRecommendations = JSON.parse(localStorage.getItem('recommendationHistory')) || {};
    setResumeHistory(storedHistory);
    if (storedHistory.length > 0 && storedRecommendations[storedHistory[0]]) {
      setRecommendations(storedRecommendations[storedHistory[0]]);
    }
  }, []);

  const cleanDescription = (description) => {
    return description
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\*|#/g, '') // Remove asterisks and hash symbols
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim();
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    // Save file name to local storage
    const newHistory = [...resumeHistory, file.name];
    localStorage.setItem('resumeHistory', JSON.stringify(newHistory));
    setResumeHistory(newHistory);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      const response = await fetch('https://jsapi.sadabahaar.com/recommend-job', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      const cleanedRecommendations = data.recommendations.map((rec) => ({
        ...rec,
        description: cleanDescription(rec.description),
      }));
      setRecommendations(cleanedRecommendations);

      // Save recommendations to local storage
      const storedRecommendations = JSON.parse(localStorage.getItem('recommendationHistory')) || {};
      storedRecommendations[file.name] = cleanedRecommendations;
      localStorage.setItem('recommendationHistory', JSON.stringify(storedRecommendations));

      toast.success("Recommendations fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (fileName) => {
    const storedRecommendations = JSON.parse(localStorage.getItem('recommendationHistory')) || {};
    if (storedRecommendations[fileName]) {
      setRecommendations(storedRecommendations[fileName]);
    } else {
      toast.error("No recommendations found for this file.");
    }
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="p-6 bg-gray-50 flex-1 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Resume</h1>
        <div className="mb-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="form-input p-2 border rounded-md"
          />
        </div>
        {loading && <div className="text-indigo-600 font-semibold">Fetching recommendations...</div>}
        {recommendations.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
            {recommendations.map((rec) => (
              <div
                key={rec.job_id}
                className="p-4 border rounded-md shadow bg-white hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-bold text-indigo-600">{rec.title}</h2>
                <p className="text-sm text-gray-600">
                  <strong>Company:</strong> {rec.company_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {rec.location || "Not Specified"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Job Type:</strong> {rec.job_type || "Not Specified"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Posted:</strong> {rec.posted_at}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Description:</strong> {rec.description.slice(0, 100)}...
                </p>
                <a
                  href={rec.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-600"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        )}
        {recommendations.length === 0 && !loading && (
          <div className="text-gray-600 italic">No recommendations to display.</div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 bg-white p-4 border-l">
        <h2 className="text-xl font-bold text-gray-800 mb-4">History</h2>
        {resumeHistory.length > 0 ? (
          <ul className="space-y-2">
            {resumeHistory.map((fileName, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-md text-gray-700 font-medium cursor-pointer hover:bg-gray-200"
                onClick={() => handleHistoryClick(fileName)}
              >
                {fileName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">No resumes uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default MessagesBody;
