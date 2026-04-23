import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import FormStepNav from '../components/FormStepNav';
import { ArrowLeft } from 'lucide-react';

const AcademicQualifications = () => {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const degrees = ['Matric', 'FSc', 'BS', 'MS', 'PhD'];

  const [formData, setFormData] = useState({
    degree: 'BS',
    institute: '',
    marks: '',
    gpa: '',
    passingYear: new Date().getFullYear()
  });

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/forms/academic-qualifications');
      setQualifications(response.data);
    } catch (error) {
      console.error('Error fetching qualifications:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = [{
      degree: formData.degree,
      institute: formData.institute,
      marks: formData.marks,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      passingYear: parseInt(formData.passingYear)
    }];
    
    try {
      await axios.post('/api/forms/academic-qualifications', payload);
      setFormData({
        degree: 'BS',
        institute: '',
        marks: '',
        gpa: '',
        passingYear: new Date().getFullYear()
      });
      fetchQualifications();
      alert('Qualification saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving qualification');
    }
    setSaving(false);
  };

  const getDegreeScore = (degree) => {
    const scores = { Matric: 5, FSc: 5, BS: 5, MS: 10, PhD: 15 };
    return scores[degree] || 0;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm mb-3 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Academic Qualifications</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Add your qualifications, then move to experience and publications.
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
        <h2 className="text-xl font-semibold mb-4">Add Qualification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({...formData, degree: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                {degrees.map(deg => (
                  <option key={deg} value={deg}>{deg} (Score: {getDegreeScore(deg)})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institute
              </label>
              <input
                type="text"
                value={formData.institute}
                onChange={(e) => setFormData({...formData, institute: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks / Percentage
              </label>
              <input
                type="text"
                value={formData.marks}
                onChange={(e) => setFormData({...formData, marks: e.target.value})}
                placeholder="e.g., 85% or A Grade"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            {(formData.degree === 'BS' || formData.degree === 'MS') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA (if applicable)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gpa}
                  onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                  placeholder="e.g., 3.6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Year
              </label>
              <input
                type="number"
                value={formData.passingYear}
                onChange={(e) => setFormData({...formData, passingYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 min-h-[44px] font-semibold"
          >
            {saving ? 'Saving...' : 'Add Qualification'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Saved Qualifications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : qualifications.length === 0 ? (
          <p className="text-gray-500">No qualifications added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Degree</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institute</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GPA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qualifications.map((q, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{q.degree}</td>
                    <td className="px-6 py-4">{q.institute}</td>
                    <td className="px-6 py-4">{q.marks || '-'}</td>
                    <td className="px-6 py-4">{q.gpa || '-'}</td>
                    <td className="px-6 py-4">{q.passingYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <h3 className="font-semibold text-blue-800">Scoring Information:</h3>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li>• Matric: 5 marks | FSc: 5 marks | BS: 5 marks | MS: 10 marks | PhD: 15 marks</li>
          <li>• Additional GPA marks: GPA &gt; 3.5 gives 5 marks (for BS and MS separately)</li>
          <li>• Maximum Academic Score: 50 marks</li>
        </ul>
      </div>
    </div>
  );
};

export default AcademicQualifications;