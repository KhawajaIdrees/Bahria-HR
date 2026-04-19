import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import FormStepNav from '../components/FormStepNav';

const ScoreCard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hiringType, setHiringType] = useState('Permanent');
  const [position, setPosition] = useState('Lecturer');
  const [applicationInfo, setApplicationInfo] = useState(null);

  const positions = ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'];

  const loadApplicationStatus = async () => {
    setStatusLoading(true);
    try {
      const { data } = await axios.get('/api/forms/application-status');
      setApplicationInfo(data);
    } catch (e) {
      console.error(e);
      setApplicationInfo({ hasSubmitted: false });
    }
    setStatusLoading(false);
  };

  useEffect(() => {
    loadApplicationStatus();
  }, []);

  useEffect(() => {
    fetchScore();
  }, [hiringType, position]);

  const fetchScore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/forms/score?hiringType=${hiringType}&position=${position}`);
      setScore(response.data);
    } catch (error) {
      console.error('Error fetching score:', error);
    }
    setLoading(false);
  };

  const hasSubmitted = !statusLoading && applicationInfo?.hasSubmitted === true;

  const handleSubmitApplication = async () => {
    if (
      !window.confirm(
        'Submit your application to the faculty hiring committee? You can still view your score afterward, but you cannot submit again.'
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/forms/submit?hiringType=${hiringType}&position=${position}`);
      await loadApplicationStatus();
      await fetchScore();
      alert('Application submitted successfully.');
    } catch (error) {
      console.error('Error submitting:', error);
      alert(error.response?.data?.message || 'Error submitting application');
    }
    setSubmitting(false);
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-green-600';
    if (s >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (s) => {
    if (s >= 70) return 'Excellent - Highly Recommended';
    if (s >= 50) return 'Good - Recommended';
    if (s >= 35) return 'Average - Consider';
    return 'Low - Not Recommended';
  };

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-1">
      <FormStepNav
        currentPath={location.pathname}
        steps={[
          { to: '/academic-qualifications', label: 'Qualifications', shortLabel: 'Qualifications' },
          { to: '/work-experience', label: 'Experience', shortLabel: 'Experience' },
          { to: '/research-publications', label: 'Publications', shortLabel: 'Publications' },
          { to: '/score-card', label: 'Score & Submit', shortLabel: 'Score Card' },
        ]}
      />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Score Card</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        Hello <span className="font-medium text-gray-800">{user?.fullName || 'applicant'}</span> — review your
        score, then submit your <strong>final application</strong> from this page when ready.
      </p>

      {/* Where submission goes */}
      <section className="mb-6 sm:mb-8 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Where your application is sent</h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          When you click <strong>Submit Final Application</strong>, your profile (qualifications, experience,
          publications) and this score are recorded in the <strong>Faculty Induction System</strong> database
          and appear on the <strong>admin panel</strong> for the hiring committee to review. You will see your
          status on the <Link className="text-primary font-medium underline" to="/">Dashboard</Link> after
          submission (e.g. Pending, Shortlisted).
        </p>
      </section>

      {statusLoading && (
        <p className="mb-4 text-sm text-gray-500 text-center sm:text-left">Checking submission status…</p>
      )}

      {/* Already submitted */}
      {hasSubmitted && (
        <div className="mb-6 sm:mb-8 rounded-xl border border-green-200 bg-green-50 p-4 sm:p-6">
          <p className="text-green-900 font-semibold text-base sm:text-lg">Application submitted</p>
          <p className="text-sm sm:text-base text-green-800 mt-2 leading-relaxed">
            Your application is on file for committee review. Current status:{' '}
            <strong>{applicationInfo.status || 'Pending'}</strong>
            {applicationInfo.application?.submittedAt && (
              <>
                {' '}
                · Submitted{' '}
                {new Date(applicationInfo.application.submittedAt).toLocaleString()}
              </>
            )}
            .
          </p>
          <p className="text-sm text-green-800 mt-3">
            <Link to="/" className="font-medium underline">
              Go to Dashboard
            </Link>{' '}
            for updates. You do not need to submit again.
          </p>
        </div>
      )}

      {/* Hiring Type and Position Selection */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Hiring options (for scoring)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="hire-type">
              Hiring Type
            </label>
            <select
              id="hire-type"
              value={hiringType}
              onChange={(e) => setHiringType(e.target.value)}
              className="w-full px-3 py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="Permanent">Permanent Faculty</option>
              <option value="POP">POP Hiring (Industry Focus)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="position">
              Applied Position
            </label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && !score && (
        <div className="text-center py-12 text-gray-600 text-sm sm:text-base">Calculating your score…</div>
      )}

      {loading && score && (
        <p className="text-center text-sm text-gray-500 mb-4">Updating score…</p>
      )}

      {score && (
        <>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 text-white text-center">
            <h2 className="text-lg sm:text-2xl font-semibold mb-2">Total Score</h2>
            <div className="text-5xl sm:text-6xl font-bold mb-2 break-all">{score.totalScore.toFixed(2)}</div>
            <div className="text-base sm:text-xl opacity-95">out of 100</div>
            <div className="mt-4 text-base sm:text-lg font-medium leading-snug px-2">
              {getScoreStatus(score.totalScore)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Academic Qualification</h3>
              <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(score.academicQualificationScore)}`}>
                {score.academicQualificationScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">out of 50</div>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                <div>
                  Matric: {score.matricScore} | FSc: {score.fScScore}
                </div>
                <div>
                  BS: {score.bSScore} | MS: {score.mSScore} | PhD: {score.phDScore}
                </div>
                <div>GPA Bonus: {score.gpaScore}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Experience</h3>
              <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(score.experienceScore)}`}>
                {score.experienceScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                out of {hiringType === 'Permanent' ? 25 : 35}
              </div>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                <div>Total Experience: {score.totalYearsExperience} years</div>
                <div>
                  MS Students: {score.supervisedMSStudents} | PhD: {score.supervisedPhDStudents}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center border border-gray-100 sm:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Research Publications</h3>
              <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(score.publicationScore)}`}>
                {score.publicationScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                out of {hiringType === 'Permanent' ? 25 : 15}
              </div>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                <div>
                  W: {score.wCategoryPapers} | X: {score.xCategoryPapers}
                </div>
                <div>
                  Y: {score.yCategoryPapers} | IF: {score.impactFactorPapers}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center px-2 pb-8">
            {!statusLoading && !hasSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="w-full sm:w-auto min-h-[48px] px-6 sm:px-10 py-3 rounded-xl text-base sm:text-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 shadow-md transition"
              >
                {submitting ? 'Submitting…' : 'Submit Final Application'}
              </button>
            ) : hasSubmitted ? (
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Submission complete. Track status on your{' '}
                <Link to="/" className="text-primary font-medium underline">
                  Dashboard
                </Link>
                .
              </p>
            ) : (
              <p className="text-sm text-gray-500">Waiting for submission status…</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScoreCard;
