import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'Admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);
  const [stats, setStats] = useState({
    qualifications: 0,
    experiences: 0,
    publications: 0,
    applicationStatus: null,
    submittedApplication: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    checkApplicationStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const [qualRes, expRes, pubRes] = await Promise.all([
        axios.get('/api/forms/academic-qualifications'),
        axios.get('/api/forms/work-experiences'),
        axios.get('/api/forms/research-publications')
      ]);

      setStats(prev => ({
        ...prev,
        qualifications: qualRes.data.length,
        experiences: expRes.data.length,
        publications: pubRes.data.length
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await axios.get('/api/forms/application-status');
      if (response.data.hasSubmitted) {
        setStats(prev => ({
          ...prev,
          applicationStatus: response.data.status,
          submittedApplication: response.data.application
        }));
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const allFormsCompleted = stats.qualifications > 0 && stats.experiences > 0 && stats.publications > 0;
  const hasSubmitted = stats.applicationStatus !== null;

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.fullName}!
        </h1>
        <p className="text-lg opacity-90">
          Complete your faculty induction application by filling out all the required forms below.
        </p>
      </div>

      {/* Application Status Banner */}
      {hasSubmitted && (
        <div className={`rounded-lg p-4 mb-8 ${
          stats.applicationStatus === 'Shortlisted' ? 'bg-green-100 border border-green-400 text-green-700' :
          stats.applicationStatus === 'Rejected' ? 'bg-red-100 border border-red-400 text-red-700' :
          'bg-yellow-100 border border-yellow-400 text-yellow-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <strong>Application Status: {stats.applicationStatus || 'Pending'}</strong>
              {stats.submittedApplication && (
                <p className="text-sm mt-1">
                  Submitted on: {new Date(stats.submittedApplication.submittedAt).toLocaleDateString()}
                  <br />
                  Total Score: {stats.submittedApplication.totalScore}/100
                </p>
              )}
            </div>
            {stats.applicationStatus === 'Shortlisted' && (
              <div className="text-sm font-semibold">
                ✓ You have been shortlisted for interview!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Progress</h2>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Forms Completion</span>
            <span>{Math.round((Object.values(stats).filter(v => v > 0).length / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(Object.values(stats).filter(v => v > 0).length / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/academic-qualifications"
            className={`block p-4 rounded-lg border-2 transition-all ${
              stats.qualifications > 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Academic Qualifications</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.qualifications} item{stats.qualifications !== 1 ? 's' : ''} added
                </p>
              </div>
              {stats.qualifications > 0 && <div className="text-green-600 text-2xl">✓</div>}
            </div>
          </Link>

          <Link
            to="/work-experience"
            className={`block p-4 rounded-lg border-2 transition-all ${
              stats.experiences > 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Work Experience</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.experiences} item{stats.experiences !== 1 ? 's' : ''} added
                </p>
              </div>
              {stats.experiences > 0 && <div className="text-green-600 text-2xl">✓</div>}
            </div>
          </Link>

          <Link
            to="/research-publications"
            className={`block p-4 rounded-lg border-2 transition-all ${
              stats.publications > 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Research Publications</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.publications} item{stats.publications !== 1 ? 's' : ''} added
                </p>
              </div>
              {stats.publications > 0 && <div className="text-green-600 text-2xl">✓</div>}
            </div>
          </Link>

          <Link
            to="/score-card"
            className={`block p-4 rounded-lg border-2 transition-all ${
              !hasSubmitted && allFormsCompleted
                ? 'border-blue-500 bg-blue-50 animate-pulse'
                : hasSubmitted
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-300 bg-white hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Submit Application</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {hasSubmitted ? 'Already Submitted' : allFormsCompleted ? 'Ready to Submit!' : 'Complete all forms first'}
                </p>
              </div>
              {!hasSubmitted && allFormsCompleted && <div className="text-blue-600 text-2xl">→</div>}
            </div>
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Submit Your Application</h3>
          <ol className="space-y-2 text-gray-600 list-decimal list-inside">
            <li>Fill out all three forms completely</li>
            <li>Go to the Score Card page</li>
            <li>Select your Hiring Type (Permanent/POP)</li>
            <li>Select your Applied Position</li>
            <li>Review your calculated score</li>
            <li>Click "Submit Final Application" button</li>
            <li>Your application will be sent to the faculty committee</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What Happens After Submission?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary mr-2">1.</span>
              Application status becomes "Pending Review"
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">2.</span>
              Faculty committee reviews your application
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">3.</span>
              Based on score, you may be "Shortlisted"
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">4.</span>
              Shortlisted candidates are called for interview
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">5.</span>
              Final decision communicated via email
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;