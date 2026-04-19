import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import FormStepNav from '../components/FormStepNav';

const ResearchPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    journalName: '',
    conferenceName: '',
    publicationYear: new Date().getFullYear(),
    category: 'Y',
    isImpactFactor: false
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/forms/research-publications');
      setPublications(response.data);
    } catch (error) {
      console.error('Error fetching publications:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = [{
      title: formData.title,
      journalName: formData.journalName,
      conferenceName: formData.conferenceName,
      publicationYear: parseInt(formData.publicationYear),
      category: formData.category,
      isImpactFactor: formData.isImpactFactor
    }];
    
    try {
      await axios.post('/api/forms/research-publications', payload);
      setFormData({
        title: '',
        journalName: '',
        conferenceName: '',
        publicationYear: new Date().getFullYear(),
        category: 'Y',
        isImpactFactor: false
      });
      fetchPublications();
      alert('Publication saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving publication');
    }
    setSaving(false);
  };

  const getCategoryScore = (category, isImpactFactor) => {
    if (isImpactFactor) return 5;
    switch(category) {
      case 'W': return 5;
      case 'X': return 3;
      case 'Y': return 1;
      default: return 0;
    }
  };

  const calculateTotalScore = () => {
    let total = 0;
    publications.forEach(pub => {
      total += getCategoryScore(pub.category, pub.isImpactFactor);
    });
    return total;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Research Publications</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Add your publications, then review your score and submit your final application.
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
        <h2 className="text-xl font-semibold mb-4">Add Publication</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal Name
              </label>
              <input
                type="text"
                value={formData.journalName}
                onChange={(e) => setFormData({...formData, journalName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conference Name
              </label>
              <input
                type="text"
                value={formData.conferenceName}
                onChange={(e) => setFormData({...formData, conferenceName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Year
              </label>
              <input
                type="number"
                value={formData.publicationYear}
                onChange={(e) => setFormData({...formData, publicationYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HEC Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="W">W Category (5 marks)</option>
                <option value="X">X Category (3 marks)</option>
                <option value="Y">Y Category (1 mark)</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isImpactFactor}
                  onChange={(e) => setFormData({...formData, isImpactFactor: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">WoS Indexed / Impact Factor Journal (5 additional marks)</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 min-h-[44px] font-semibold"
          >
            {saving ? 'Saving...' : 'Add Publication'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Publications List</h2>
          <div className="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold">
            Total Publication Score: {calculateTotalScore()} / 25
          </div>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : publications.length === 0 ? (
          <p className="text-gray-500">No publications added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal/Conference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publications.map((pub, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">{pub.title.substring(0, 50)}...</td>
                    <td className="px-6 py-4">{pub.journalName || pub.conferenceName || '-'}</td>
                    <td className="px-6 py-4">{pub.publicationYear}</td>
                    <td className="px-6 py-4">
                      {pub.isImpactFactor ? 'Impact Factor' : `HEC ${pub.category}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      {getCategoryScore(pub.category, pub.isImpactFactor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <h3 className="font-semibold text-blue-800">Publication Scoring Formula:</h3>
        <p className="mt-2 text-sm text-blue-700">
          <strong>Score = (W × 5) + (X × 3) + (Y × 1) + (IF × 5)</strong>
        </p>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li>• W Category: 5 marks per paper</li>
          <li>• X Category: 3 marks per paper</li>
          <li>• Y Category: 1 mark per paper</li>
          <li>• Impact Factor (WoS): 5 marks per paper</li>
          <li className="font-semibold">• Maximum for Permanent Faculty: 25 marks | POP Hiring: 15 marks</li>
        </ul>
      </div>
    </div>
  );
};

export default ResearchPublications;