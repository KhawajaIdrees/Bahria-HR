import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'National',
    cnic: '',
    passportNumber: '',
    phone: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const registerData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
      idNumber: formData.userType === 'National' ? formData.cnic : formData.passportNumber,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth || null
    };

    const result = await register(registerData);

    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sticky Header for Desktop */}
      <div className="hidden lg:flex lg:w-1/3 bg-white sticky top-0 h-screen flex-col items-center justify-center p-8 border-r border-gray-200">
        <div className="text-center max-w-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600 mb-8">Register for Faculty Induction System</p>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-900">Quick Info:</span> Fill out all fields to create your account. You can apply for positions after registration.
              </p>
            </div>
            <div className="text-left space-y-3">
              <div className="flex items-start">
                <div className="text-blue-600 font-bold mr-3">✓</div>
                <div>
                  <p className="font-semibold text-gray-900">Secure Registration</p>
                  <p className="text-xs text-gray-600">Your data is encrypted</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 font-bold mr-3">✓</div>
                <div>
                  <p className="font-semibold text-gray-900">Choose Your Type</p>
                  <p className="text-xs text-gray-600">National or Foreigner</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 font-bold mr-3">✓</div>
                <div>
                  <p className="font-semibold text-gray-900">Instant Access</p>
                  <p className="text-xs text-gray-600">Login immediately after</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Form Area */}
      <div className="w-full lg:w-2/3 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 lg:p-0 lg:shadow-none">
            {/* Mobile Header - Hidden on Desktop */}
            <div className="lg:hidden mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="mt-2 text-sm text-gray-600">Register for Faculty Induction</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Applicant Type Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Applicant Type</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="national"
                      name="userType"
                      value="National"
                      checked={formData.userType === 'National'}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <label htmlFor="national" className="ml-3 text-sm text-gray-700 cursor-pointer">
                      National Citizen (CNIC)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="foreigner"
                      name="userType"
                      value="Foreigner"
                      checked={formData.userType === 'Foreigner'}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <label htmlFor="foreigner" className="ml-3 text-sm text-gray-700 cursor-pointer">
                      Foreigner (Passport)
                    </label>
                  </div>
                </div>
              </div>

              {/* ID Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Identification</h3>
                
                {formData.userType === 'National' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CNIC</label>
                    <input
                      type="text"
                      name="cnic"
                      placeholder="12345-1234567-1"
                      value={formData.cnic}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}

                {formData.userType === 'Foreigner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Passport Number *</label>
                    <input
                      type="text"
                      name="passportNumber"
                      placeholder="e.g., AB1234567"
                      required={formData.userType === 'Foreigner'}
                      value={formData.passportNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">Please provide your valid passport number</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>

              {/* Sign In Link */}
              <div className="text-sm text-center">
                <Link to="/login" className="text-primary hover:text-secondary font-semibold">
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;