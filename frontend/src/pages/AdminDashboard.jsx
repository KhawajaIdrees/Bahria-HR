import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TABS = [
  { id: 'all', label: 'All submitted' },
  { id: 'pending', label: 'Pending review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'hired', label: 'Hired' },
  { id: 'incomplete', label: 'Not submitted yet' },
];

function statusBadgeClass(status) {
  switch (status) {
    case 'Shortlisted':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'Hired':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    default:
      return 'bg-amber-100 text-amber-900 border border-amber-200';
  }
}

function matchesSearch(row, q) {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  const name = (row.user?.fullName || '').toLowerCase();
  const email = (row.user?.email || '').toLowerCase();
  const pos = (row.appliedPosition || '').toLowerCase();
  return name.includes(s) || email.includes(s) || pos.includes(s);
}

function matchesIncomplete(row, q) {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  return (
    (row.fullName || '').toLowerCase().includes(s) ||
    (row.email || '').toLowerCase().includes(s)
  );
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('submitted');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, appsRes, incRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/applications'),
          axios.get('/api/admin/applicants/incomplete'),
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
        setIncomplete(incRes.data);
      } catch (e) {
        const msg = e.response?.data?.message;
        const net =
          e.code === 'ERR_NETWORK' ||
          e.message === 'Network Error' ||
          !e.response;
        setError(
          net
            ? 'Cannot reach the API. Start the backend: open a terminal in the backend folder and run: dotnet run --urls "http://localhost:5000" — then refresh. Also log in as admin (admin@faculty.com) to view this page.'
            : msg || 'Could not load data. If you see 403, your account is not an admin.'
        );
      }
      setLoading(false);
    };
    load();
  }, []);

  const filteredApplications = useMemo(() => {
    if (tab === 'incomplete') return [];
    let list = applications.filter((a) => matchesSearch(a, search));
    if (tab !== 'all') {
      const targetStatus = tab.charAt(0).toUpperCase() + tab.slice(1);
      list = list.filter((a) => a.status === targetStatus);
    }
    const sorted = [...list];
    if (sortBy === 'score') {
      sorted.sort((a, b) => Number(b.totalScore) - Number(a.totalScore));
    } else {
      sorted.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }
    return sorted;
  }, [applications, tab, search, sortBy]);

  const filteredIncomplete = useMemo(() => {
    return incomplete.filter((r) => matchesIncomplete(r, search));
  }, [incomplete, search]);

  const showIncomplete = tab === 'incomplete';

  if (loading) {
    return (
      <div className="text-center py-16 px-4 text-gray-600 text-sm sm:text-base">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-1">
      <header className="mb-6 sm:mb-8 px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Admin dashboard
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
          Track <strong>pending</strong> applications, shortlists, and applicants who registered but have
          not completed final submission on the Score Card yet.
        </p>
      </header>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stat cards — tap to filter */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
          {[
            { key: 'all', label: 'Submitted', value: stats.totalSubmitted, hint: 'All statuses' },
            { key: 'pending', label: 'Pending', value: stats.pending, hint: 'Awaiting review' },
            { key: 'shortlisted', label: 'Shortlisted', value: stats.shortlisted, hint: null },
            { key: 'rejected', label: 'Rejected', value: stats.rejected, hint: null },
            { key: 'hired', label: 'Hired', value: stats.hired, hint: null },
            { key: 'incomplete', label: 'Not submitted', value: stats.incompleteProfiles, hint: 'No final submit' },
          ].map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => setTab(card.key)}
              className={`text-left rounded-xl border p-3 sm:p-4 transition shadow-sm min-h-[88px] sm:min-h-0 ${
                tab === card.key
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-gray-500 truncate">
                {card.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              {card.hint && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                  {card.hint}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tabs — horizontal scroll on small screens */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 px-1">
        <div className="w-full overflow-x-auto pb-1 -mx-1 px-1">
          <div className="flex gap-1 min-w-max sm:flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-primary text-white shadow'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {!showIncomplete && (
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            <label className="sr-only" htmlFor="admin-sort">
              Sort by
            </label>
            <select
              id="admin-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="submitted">Newest submission first</option>
              <option value="score">Highest score first</option>
            </select>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 px-1">
        <label htmlFor="admin-search" className="sr-only">
          Search
        </label>
        <input
          id="admin-search"
          type="search"
          placeholder={
            showIncomplete ? 'Search by name or email…' : 'Search by name, email, or position…'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg text-sm sm:text-base border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
        />
      </div>

      {/* Incomplete applicants */}
      {showIncomplete && (
        <section className="space-y-3 px-1">
          <p className="text-sm text-gray-600 mb-2">
            These accounts completed registration but have <strong>not</strong> pressed &quot;Submit Final
            Application&quot; on the Score Card. They may still be editing their forms.
          </p>
          {filteredIncomplete.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
              No registered applicants in this category.
            </div>
          ) : (
            <>
              <ul className="md:hidden space-y-3">
                {filteredIncomplete.map((row) => (
                  <li
                    key={row.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900">{row.fullName}</p>
                    <p className="text-sm text-gray-600 break-all">{row.email}</p>
                    {row.phone && <p className="text-sm text-gray-500 mt-1">{row.phone}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      Registered {row.registeredAt ? new Date(row.registeredAt).toLocaleString() : '—'}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredIncomplete.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{row.fullName}</td>
                          <td className="px-4 py-3 text-gray-600 break-all">{row.email}</td>
                          <td className="px-4 py-3 text-gray-600">{row.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {row.registeredAt ? new Date(row.registeredAt).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Submitted applications */}
      {!showIncomplete && (
        <>
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm mx-1">
              No applications match this filter.
            </div>
          ) : (
            <>
              <ul className="md:hidden space-y-3 px-1">
                {filteredApplications.map((row) => (
                  <li
                    key={row.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex justify-between gap-2 items-start mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{row.user?.fullName ?? '—'}</p>
                        <p className="text-xs text-gray-600 break-all">{row.user?.email}</p>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-700 mt-3">
                      <div>
                        <dt className="text-gray-500">Position</dt>
                        <dd className="font-medium">{row.appliedPosition}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Hiring</dt>
                        <dd className="font-medium">{row.hiringType}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Score</dt>
                        <dd className="font-medium">{Number(row.totalScore).toFixed(1)}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-gray-500">Submitted</dt>
                        <dd className="font-medium">
                          {row.submittedAt ? new Date(row.submittedAt).toLocaleString() : '—'}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      to={`/admin/applications/${row.id}`}
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      View full application →
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mx-1">
                <div className="overflow-x-auto">
                  <table className="min-w-[800px] w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Applicant</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Position</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Hiring</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Score</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Submitted</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredApplications.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                            {row.user?.fullName ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={row.user?.email}>
                            {row.user?.email ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{row.appliedPosition}</td>
                          <td className="px-4 py-3 text-gray-700">{row.hiringType}</td>
                          <td className="px-4 py-3 text-gray-900">{Number(row.totalScore).toFixed(1)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(row.status)}`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                            {row.submittedAt ? new Date(row.submittedAt).toLocaleString() : '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              to={`/admin/applications/${row.id}`}
                              className="text-primary hover:underline font-medium"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
