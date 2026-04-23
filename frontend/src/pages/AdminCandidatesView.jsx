import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Search, ArrowLeft } from 'lucide-react';

const TABS = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'hired', label: 'Hired' },
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

const AdminCandidatesView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/admin/applications');
        setApplications(res.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load candidates.');
      }
      setLoading(false);
    };
    load();
  }, []);

  const onCandidateUpdated = (candidateId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id.toString() === candidateId.toString() 
        ? { ...app, status: newStatus } 
        : app
    ));
  };

  const filteredApplications = useMemo(() => {
    let list = applications.filter((a) => matchesSearch(a, search));
    if (tab !== 'all') {
      const targetStatus = tab.charAt(0).toUpperCase() + tab.slice(1);
      list = list.filter((a) => a.status === targetStatus);
    }
    return list.sort((a, b) => Number(b.totalScore) - Number(a.totalScore));
  }, [applications, tab, search]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50/50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-slate-500 font-medium">Fetching pipelines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-gray-50/50 overflow-hidden">
      {/* Left Pipeline Pane */}
      <div className="flex flex-col w-[350px] xl:w-[420px] bg-white border-r border-slate-200 shadow-lg z-10 shrink-0 h-full p-4 overflow-hidden relative">
        <div className="mb-4">
           <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => navigate('/admin')} 
                className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                title="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl font-bold text-slate-800">Candidate Pipeline</h2>
           </div>
           <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
              />
           </div>
           <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide">
              <button
                 onClick={() => { setTab('all'); navigate('/admin/candidates'); }}
                 className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    tab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                 }`}
              >
                 All
              </button>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); navigate('/admin/candidates'); }}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    tab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
           </div>
        </div>

        {error && <div className="mb-4 bg-red-50 text-red-700 p-2 text-sm rounded-lg border border-red-100">{error}</div>}

        <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-6">
           {filteredApplications.length === 0 ? (
             <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
               <p className="text-slate-500 font-medium text-sm">No matches found.</p>
             </div>
           ) : (
             <ul className="space-y-2">
               {filteredApplications.map((row) => {
                 const isSelected = row.id.toString() === id;
                 return (
                   <li key={row.id}>
                     <div
                       onClick={() => navigate(`/admin/candidates/${row.id}`)}
                       className={`group cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 select-none ${
                         isSelected 
                           ? 'bg-primary/5 border-primary ring-1 ring-primary/50 shadow-sm' 
                           : 'bg-white border-slate-200 hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-sm'
                       }`}
                     >
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border transition-colors ${
                         isSelected 
                           ? 'bg-primary text-white border-primary' 
                           : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20'
                       }`}>
                         {(row.user?.fullName || row.fullName || 'A')[0].toUpperCase()}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-0.5 gap-2">
                           <h3 className={`font-bold truncate text-sm transition-colors ${isSelected ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
                             {row.user?.fullName || row.fullName || 'Unknown'}
                           </h3>
                           <span className="text-xs font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{Number(row.totalScore).toFixed(1)}</span>
                         </div>
                         <p className="text-[11px] font-medium text-slate-500 truncate mb-1.5">{row.appliedPosition}</p>
                         <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${statusBadgeClass(row.status)}`}>
                           {row.status}
                         </span>
                       </div>
                     </div>
                   </li>
                 );
               })}
             </ul>
           )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 h-full bg-white relative">
         {id ? (
            <Outlet context={{ onCandidateUpdated }} />
         ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-50">
               <div className="text-center p-8">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Search size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">Select a Candidate</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">Choose a candidate from the left pipeline to view their detailed interactive profile.</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminCandidatesView;
