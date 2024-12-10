import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ProfileBg from '../../images/profile-bg.jpg';
import UserAvatar from '../../images/user-128-01.jpg';

function ProfileBody() {
  const [profileData, setProfileData] = useState(null);
  const [baseProfileData, setBaseProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        toast.error('User ID not found in local storage');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://jsapi.sadabahaar.com/profiles/profiles/${userId}`, {
          headers: { accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
        // toast.success('Profile data loaded successfully');
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProfileBaseData = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        toast.error('User ID not found in local storage');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://jsapi.sadabahaar.com/users/users/${userId}`, {
          headers: { accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setBaseProfileData(data);
        // toast.success('Profile data loaded successfully');
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
    fetchProfileBaseData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!profileData) {
    return <div className="text-center py-8">No profile data available</div>;
  }

  return (
    <div className="grow flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Profile background */}
      <div className="relative h-56 bg-slate-200">
        <img
          className="object-cover h-full w-full"
          src={profileData.user_data?.coverImageUrl || ProfileBg}
          width="979"
          height="220"
          alt="Profile background"
        />
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 pb-8">
        {/* Pre-header */}
        <div className="-mt-16 mb-6 sm:mb-3">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
            {/* Avatar */}
            <div className="inline-flex -ml-1 -mt-1 mb-4 sm:mb-0">
              <img
                className="rounded-full border-4 border-white"
                src={profileData.user_data?.profileImageUrl || UserAvatar}
                width="128"
                height="128"
                alt="Avatar"
              />
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="text-center sm:text-left mb-6">
          {/* Name */}
          <div className="inline-flex items-start mb-2">
            <h1 className="text-2xl text-slate-800 font-bold">{baseProfileData?.name || "User Name" }</h1>
          </div>
          {/* Bio */}
          <div className="text-sm mb-3">{profileData.user_data?.bio || 'No bio available'}</div>
          {/* Meta */}
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 fill-current shrink-0 text-slate-400" viewBox="0 0 16 16">
                <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
              </svg>
              <span className="text-sm font-medium whitespace-nowrap text-slate-500 ml-2">
                {profileData.user_data?.currentLocation || 'No location available'}
              </span>
            </div>
            {profileData.user_data?.linkedinLink && (
              <div className="flex items-center">
                <a
                  className="text-sm font-medium whitespace-nowrap text-indigo-500 hover:text-indigo-600 ml-2"
                  href={profileData.user_data.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            )}
          </div>
        </header>

        <hr className="relative px-4 sm:px-6 pb-8"></hr>

        {/* Profile content */}
        <div className="flex flex-col xl:flex-row xl:space-x-16">
          {/* Main content */}
          <div className="space-y-5 mb-8 xl:mb-0">
            {/* About Me */}
            <div>
              <h2 className="text-slate-800 font-semibold mb-2">About Me</h2>
              <div className="text-sm space-y-2">
                <p>{profileData.bio || 'No about me information available'}</p>
              </div>
            </div>

            {/* Work History */}
            <div>
              <h2 className="text-slate-800 font-semibold mb-2">Work History</h2>
              <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
                <ul className="space-y-3">
                  {profileData.work_history.map((work, index) => (
                    <li key={index} className="sm:flex sm:items-center sm:justify-between">
                      <div className="sm:grow flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full shrink-0 bg-indigo-500 my-2 mr-3"></div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {work.role} <span className="text-slate-500">| {work.location}</span>
                          </div>
                          <div className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">
                            <div>
                              {new Date(work.startDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                              })}{' '}
                              to{' '}
                              {work.endDate.toLowerCase() === 'present'
                                ? 'Present'
                                : new Date(work.endDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="xl:min-w-56 xl:w-56 space-y-3">
            <div className="text-sm">
              <h3 className="font-medium text-slate-800">Title</h3>
              <div>
                {profileData.work_history && profileData.work_history.length > 0 ? (
                  <div>{profileData.work_history[0].role}</div>
                ) : (
                  <div>No experience</div>
                )}
              </div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-slate-800">Location</h3>
              <div>{profileData.user_data?.currentLocation || 'No location available'}</div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-slate-800">Email</h3>
              <div>{baseProfileData?.email || 'No email available'}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;
