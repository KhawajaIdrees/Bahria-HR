import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { user, token } = useContext(AuthContext); // Assuming AuthContext provides user & token
    const navigate = useNavigate();
    
    // Profile State
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    
    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fullName, phone })
            });
            if (response.ok) alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    const savePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            if (response.ok) {
                alert('Password updated!');
                setOldPassword('');
                setNewPassword('');
            } else {
                alert('Error updating password');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                &larr; Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

            {/* Profile Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <form onSubmit={saveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Save Profile</button>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Security</h2>
                <form onSubmit={savePassword} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">Update Password</button>
                </form>
            </div>
        </div>
    );
}