import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_OPTIONS = ['Pending', 'Shortlisted', 'Rejected', 'Hired'];

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/admin/applications/${id}`);
        setData(res.data);
        setStatus(res.data.application?.status || '');
      } catch (e) {
        setError(e.response?.status === 404 ? 'Application not found.' : 'Failed to load.');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleStatusSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status });
      const res = await axios.get(`/api/admin/applications/${id}`);
      setData(res.data);
      setStatus(res.data.application?.status || status);
      alert('Status updated.');
    } catch (e) {
      alert(e.response?.data?.message || 'Could not update status.');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading…</div>;
  }

  if (error || !data?.application) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Not found.'}</p>
        <Link to="/admin" className="text-primary hover:underline">
          Back to admin dashboard
        </Link>
      </div>
    );
  }

  const app = data.application;
  const user = app.user;
  const score = data.detailedScore;

  return (
    <div className="max-w-5xl mx-auto px-1 sm:px-0">
      <button
        type="button"
        onClick={() => navigate('/admin')}
        className="text-sm text-primary hover:underline mb-4 sm:mb-6"
      >
        ← Back to all submissions
      </button>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">Application #{app.id}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Applicant</span>
            <p className="font-medium text-gray-900">{user?.fullName}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone</span>
            <p className="font-medium text-gray-900">{user?.phone || '—'}</p>
          </div>
          <div>
            <span className="text-gray-500">Submitted</span>
            <p className="font-medium text-gray-900">
              {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '—'}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Position</span>
            <p className="font-medium text-gray-900">{app.appliedPosition}</p>
          </div>
          <div>
            <span className="text-gray-500">Hiring type</span>
            <p className="font-medium text-gray-900">{app.hiringType}</p>
          </div>
          <div>
            <span className="text-gray-500">Total score</span>
            <p className="font-medium text-gray-900">{Number(app.totalScore).toFixed(1)} / 100</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3 border-t pt-6">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Application status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-auto min-h-[44px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleStatusSave}
            disabled={saving || status === app.status}
            className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 min-h-[44px] w-full sm:w-auto"
          >
            {saving ? 'Saving…' : 'Save status'}
          </button>
        </div>
      </div>

      {score && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Score breakdown</h2>
          <pre className="text-[10px] sm:text-xs bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto text-gray-800 max-w-full">
            {JSON.stringify(score, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic qualifications</h2>
        <ul className="space-y-2 text-sm">
          {(user?.academicQualifications || []).map((q) => (
            <li key={q.id} className="border-b border-gray-100 pb-2">
              <strong>{q.degree}</strong> — {q.institute} ({q.passingYear})
            </li>
          ))}
          {(!user?.academicQualifications || user.academicQualifications.length === 0) && (
            <li className="text-gray-500">None</li>
          )}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Work experience</h2>
        <ul className="space-y-2 text-sm">
          {(user?.workExperiences || []).map((w) => (
            <li key={w.id} className="border-b border-gray-100 pb-2">
              <strong>{w.positionTitle}</strong> at {w.organizationName}
            </li>
          ))}
          {(!user?.workExperiences || user.workExperiences.length === 0) && (
            <li className="text-gray-500">None</li>
          )}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Research publications</h2>
        <ul className="space-y-2 text-sm">
          {(user?.researchPublications || []).map((p) => (
            <li key={p.id} className="border-b border-gray-100 pb-2">
              {p.title} — {p.publicationYear}
            </li>
          ))}
          {(!user?.researchPublications || user.researchPublications.length === 0) && (
            <li className="text-gray-500">None</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminApplicationDetail;
