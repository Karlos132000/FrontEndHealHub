import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css'; // Ensure you import the CSS file correctly

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        city: '',
        region: '',
        role: 'user',
        specialtyId: null,
        clinicId: null,
        phoneNumber: '',

    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3360/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                navigate('/login');
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed due to a network error.');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Регистрация</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleChange} required />
                <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />

                {/*<input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} />*/}
                {/*<input type="number" name="specialtyId" placeholder="Specialty ID (optional)" value={formData.specialtyId} onChange={handleChange} />*/}
                {/*<input type="number" name="clinicId" placeholder="Clinic ID" value={formData.clinicId} onChange={handleChange} />*/}

                <button type="submit">Регистрация</button>
            </form>
        </div>
    );
};

export default RegisterPage;
