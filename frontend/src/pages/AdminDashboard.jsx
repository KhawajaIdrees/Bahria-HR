import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, UserCheck, Clock, XCircle, FileText, Briefcase, ChevronRight, TrendingUp } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Candidates' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'hired', label: 'Hired' },
  { id: 'incomplete', label: 'Incomplete' },
];

function statusBadgeClass(status) {
  switch (status) {
    case 'Shortlisted': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'Rejected': return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'Hired': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    default: return 'bg-amber-100 text-amber-800 border border-amber-200';
  }
}

function matchesSearch(row, q) {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  const name = (row.user?.fullName || row.fullName || '').toLowerCase();
  const email = (row.user?.email || row.email || '').toLowerCase();
  const pos = (row.appliedPosition || '').toLowerCase();
  return name.includes(s) || email.includes(s) || pos.includes(s);
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score');

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
        setError(e.response?.data?.message || 'Failed to load dashboard data.');
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
    return list.sort((a, b) => 
      sortBy === 'score' 
        ? Number(b.totalScore) - Number(a.totalScore)
        : new Date(b.submittedAt) - new Date(a.submittedAt)
    );
  }, [applications, tab, search, sortBy]);

  const filteredIncomplete = useMemo(() => {
    return incomplete.filter((r) => matchesSearch(r, search));
  }, [incomplete, search]);

  const showIncomplete = tab === 'incomplete';
  const listToRender = showIncomplete ? filteredIncomplete : filteredApplications;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-slate-500 font-medium">Fetching dashboard data...</p>
        </div>
      </div>
    );
  }

  const statCardsData = stats ? [
    { key: 'all', label: 'Total Applicants', value: stats.totalSubmitted, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { key: 'pending', label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { key: 'shortlisted', label: 'Shortlisted', value: stats.shortlisted, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { key: 'rejected', label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { key: 'hired', label: 'Hired', value: stats.hired, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { key: 'incomplete', label: 'Incomplete', value: stats.incompleteProfiles, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
  ] : [];

  function Users(props) { return <UserCheck {...props} />; }

  return (
    <div className="flex h-full w-full bg-gray-50/50">
      <div className="flex flex-col w-full mx-auto max-w-7xl p-6 h-full overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of all candidate applications across all stages.</p>
        </div>

        {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCardsData.map((card) => (
            <button
              key={card.key}
              onClick={() => setTab(card.key)}
              className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group ${
                tab === card.key ? 'border-primary ring-1 ring-primary shadow-md bg-white' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon size={20} />
              </div>
              <span className="text-3xl font-bold text-slate-900 mb-1">{card.value}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{card.label}</span>
              {tab === card.key && <div className="absolute top-0 right-0 p-4 opacity-10 text-primary"><TrendingUp size={64}/></div>}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Search candidate name, email, or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-1 w-full">
             <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      tab === t.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
             </div>
             
             {!showIncomplete && (
               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="text-xs font-medium border border-slate-200 text-slate-600 rounded-lg px-3 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
               >
                 <option value="score">Top Scored</option>
                 <option value="submitted">Most Recent</option>
               </select>
             )}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto pb-4">
           {listToRender.length === 0 ? (
             <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Search size={24} className="text-slate-400" />
               </div>
               <p className="text-slate-500 font-medium text-sm">No applications found.</p>
             </div>
           ) : (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/80 border-b border-slate-200">
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                       {!showIncomplete && (
                         <>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Position & Hiring</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Score</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                         </>
                       )}
                       {showIncomplete && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>}
                       <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {listToRender.map((row) => (
                       <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                               {(row.user?.fullName || row.fullName || 'A')[0].toUpperCase()}
                             </div>
                             <div>
                               <p className="font-bold text-slate-900 text-sm">{row.user?.fullName || row.fullName}</p>
                               <p className="text-xs text-slate-500">{row.user?.email || row.email}</p>
                             </div>
                           </div>
                         </td>
                         
                         {!showIncomplete && (
                           <>
                             <td className="px-6 py-4">
                               <p className="font-semibold text-slate-800 text-sm">{row.appliedPosition}</p>
                               <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                 {row.hiringType}
                               </span>
                             </td>
                             <td className="px-6 py-4">
                               <div className="flex items-center gap-2 max-w-[120px]">
                                 <span className="font-extrabold text-slate-900 text-sm w-8">{Number(row.totalScore).toFixed(0)}</span>
                                 <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, Number(row.totalScore))}%` }}></div>
                                 </div>
                               </div>
                             </td>
                             <td className="px-6 py-4">
                               <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusBadgeClass(row.status)}`}>
                                 {row.status}
                               </span>
                             </td>
                           </>
                         )}

                         {showIncomplete && (
                           <td className="px-6 py-4 text-sm text-slate-600">
                             {row.registeredAt ? new Date(row.registeredAt).toLocaleDateString() : '—'}
                           </td>
                         )}

                         <td className="px-6 py-4 text-right">
                           <Link
                             to={showIncomplete ? '#' : `/admin/candidates/${row.id}`}
                             className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
                             title="View Profile"
                           >
                             <ChevronRight size={18} />
                           </Link>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
