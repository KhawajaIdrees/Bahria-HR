import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { X, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, BookOpen, Send, MoreVertical, Edit3, ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Shortlisted', 'Rejected', 'Hired'];

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const { onCandidateUpdated } = useOutletContext() || {};

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const openMessageModal = () => setShowMessageModal(true);
  const closeMessageModal = () => {
    if (!sendingMessage) {
      setMessageText('');
      setShowMessageModal(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      alert('Message cannot be empty.');
      return;
    }
    setSendingMessage(true);
    try {
      const response = await axios.post(`/api/admin/applications/${id}/message`, { message: messageText });
      alert(response.data.message || 'Message sent successfully.');
      closeMessageModal();
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to send message. Please check your SMTP configuration.';
      alert(errorMessage);
      console.error('Message send error:', e);
    } finally {
      setSendingMessage(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/admin/applications/${id}`);
        setData(res.data);
        setStatus(res.data.application?.status || '');
      } catch (e) {
        setError(e.response?.status === 404 ? 'Application not found.' : 'Failed to load details.');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleStatusSave = async (newStatus) => {
    setSaving(true);
    setStatus(newStatus);
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status: newStatus });
      const res = await axios.get(`/api/admin/applications/${id}`);
      setData(res.data);
      if (onCandidateUpdated) {
        onCandidateUpdated(id, newStatus);
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Could not update status.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium font-sans">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.application) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-600 font-medium mb-4">{error || 'Record unresolvable.'}</p>
        <button onClick={() => navigate('/admin')} className="text-primary hover:underline font-bold">
          Close Pane
        </button>
      </div>
    );
  }

  const app = data.application;
  const user = app?.user || { fullName: 'Unknown', email: 'N/A', phone: 'N/A' };
  const score = data.detailedScore;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden font-sans border-l border-slate-200">
      {/* Sticky Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex justify-between items-start pt-6">
        <div className="flex gap-4 flex-1">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors mt-2 shrink-0"
            title="Back to candidates"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-700 border border-slate-300 shadow-sm shrink-0">
            {(user?.fullName || 'A')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1">{user?.fullName}</h2>
            <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
              <Briefcase size={14} /> {app.appliedPosition} <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 uppercase tracking-widest text-slate-600">{app.hiringType}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            {/* Fake dropdown for status change */}
            <button
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              disabled={saving}
            >
              <Edit3 size={16} />
              {saving ? 'Updating...' : status}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 overflow-hidden">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-medium text-slate-700"
                  onClick={() => handleStatusSave(opt)}
                >
                  Mark as {opt}
                </button>
              ))}
            </div>
          </div>

          <button onClick={openMessageModal} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
            <Send size={16} /> <span className="hidden xl:inline">Message</span>
          </button>

          <button onClick={() => navigate('/admin')} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors ml-2">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Phone size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Applied on</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        {score && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Score Evaluation</h3>
              <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-black shadow-sm">{Number(app.totalScore).toFixed(1)} / 100 PTS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><GraduationCap size={64} /></div>
                <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-1 relative">Academics</h4>
                <p className="text-4xl font-black text-slate-900 relative">{Number(score.academicQualificationScore).toFixed(1)}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform"><Briefcase size={64} /></div>
                <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-1 relative">Experience</h4>
                <p className="text-4xl font-black text-slate-900 relative">{Number(score.experienceScore).toFixed(1)}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-600 group-hover:scale-110 transition-transform"><BookOpen size={64} /></div>
                <h4 className="text-xs font-extrabold text-rose-600 uppercase tracking-widest mb-1 relative">Publications</h4>
                <p className="text-4xl font-black text-slate-900 relative">{Number(score.publicationScore).toFixed(1)}</p>
              </div>
            </div>
          </section>
        )}

        {/* Academic Profile */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <GraduationCap size={20} className="text-slate-400" />
            <h3 className="text-lg font-bold">Education History</h3>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {(!user?.academicQualifications || user.academicQualifications.length === 0) ? (
              <div className="p-8 text-center text-slate-500 font-medium">No education listed.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {user.academicQualifications.map(q => (
                  <div key={q.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-base">{q.degree}</h4>
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold font-mono">
                        {q.gpa ? `GPA: ${q.gpa}` : `Marks: ${q.marks}`}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium text-sm">{q.institute}</p>
                    <p className="text-slate-400 text-xs mt-2 font-semibold">Graduated {q.passingYear}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Work Profile */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <Briefcase size={20} className="text-slate-400" />
            <h3 className="text-lg font-bold">Experience Details</h3>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {(!user?.workExperiences || user.workExperiences.length === 0) ? (
              <div className="p-8 text-center text-slate-500 font-medium">No work experience listed.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {user.workExperiences.map(w => (
                  <div key={w.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-base">{w.positionTitle}</h4>
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                        {w.isCurrentJob ? 'Current' : 'Past'}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium text-sm flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {w.organizationName}</p>
                    <p className="text-slate-400 text-xs mt-2 font-semibold">
                      {w.startDate ? new Date(w.startDate).toLocaleDateString() : '—'} &rarr; {w.isCurrentJob ? 'Present' : (w.endDate ? new Date(w.endDate).toLocaleDateString() : '—')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Publications */}
        <section className="pb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <BookOpen size={20} className="text-slate-400" />
            <h3 className="text-lg font-bold">Research Papers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(!user?.researchPublications || user.researchPublications.length === 0) ? (
              <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 font-medium shadow-sm">No research published.</div>
            ) : (
              user.researchPublications.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2">{p.title}</h4>
                  <p className="text-slate-500 text-xs mb-3 truncate" title={p.journalName}>Published in: <span className="font-semibold text-slate-700">{p.journalName || 'Unknown'}</span></p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">{p.publicationYear}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Type: {p.category || 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {showMessageModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6">
              <h2 className="text-xl font-semibold mb-4">Send Message to Applicant</h2>
              <textarea
                className="w-full h-32 p-2 border rounded mb-4"
                placeholder="Enter your message..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={closeMessageModal}
                  disabled={sendingMessage}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  onClick={handleSendMessage}
                  disabled={sendingMessage}
                >
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationDetail;
