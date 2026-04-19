import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import FormStepNav from '../components/FormStepNav';

const WorkExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    organizationName: '',
    positionTitle: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/forms/work-experiences');
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = [{
      organizationName: formData.organizationName,
      positionTitle: formData.positionTitle,
      startDate: formData.startDate,
      endDate: formData.isCurrentJob ? null : formData.endDate,
      isCurrentJob: formData.isCurrentJob
    }];
    
    try {
      await axios.post('/api/forms/work-experiences', payload);
      setFormData({
        organizationName: '',
        positionTitle: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false
      });
      fetchExperiences();
      alert('Work experience saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving work experience');
    }
    setSaving(false);
  };

  const calculateDuration = (start, end, isCurrent) => {
    const startDate = new Date(start);
    const endDate = isCurrent ? new Date() : new Date(end);
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    
    if (years === 0) return `${months} months`;
    return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} months` : ''}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Teaching & Research Experience</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Add your relevant work experience. Then continue to publications.
        </p>
      </div>

      <FormStepNav
        currentPath={location.pathname}
        steps={[
          { to: '/academic-qualifications', label: 'Qualifications', shortLabel: 'Qualifications' },
          { to: '/work-experience', label: 'Experience', shortLabel: 'Experience' },
          { to: '/research-publications', label: 'Publications', shortLabel: 'Publications' },
          { to: '/score-card', label: 'Score & Submit', shortLabel: 'Score Card' },
        ]}
      />
      
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Add Experience</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Title
              </label>
              <input
                type="text"
                value={formData.positionTitle}
                onChange={(e) => setFormData({...formData, positionTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                disabled={formData.isCurrentJob}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isCurrentJob}
                  onChange={(e) => setFormData({...formData, isCurrentJob: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">I currently work here</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 min-h-[44px] font-semibold"
          >
            {saving ? 'Saving...' : 'Add Experience'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Work History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500">No work experience added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experiences.map((exp, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{exp.organizationName}</td>
                    <td className="px-6 py-4">{exp.positionTitle}</td>
                    <td className="px-6 py-4">{new Date(exp.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {exp.isCurrentJob ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{calculateDuration(exp.startDate, exp.endDate, exp.isCurrentJob)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <h3 className="font-semibold text-blue-800">Experience Scoring (Permanent Faculty):</h3>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li>• Lecturer (18+ years experience): 5 marks</li>
          <li>• Assistant Professor (Post PhD 5 years OR total 10 years): 10 marks</li>
          <li>• Associate Professor (Post PhD 5 years OR total 10 years): 15 marks</li>
          <li>• Professor (Post PhD 10 years OR total 15 years): 20 marks</li>
          <li>• Additional: MS supervision (1 mark) | PhD supervision (2 marks)</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkExperience;