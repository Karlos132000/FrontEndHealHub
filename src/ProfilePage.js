import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './ProfilePage.css';
const ProfilePage = () => {

    const [userDetails, setUserDetails] = useState({});
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetailsAndAppointments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch user details
            try {
                const userDetailsResponse = await fetch('http://localhost:3360/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!userDetailsResponse.ok) {
                    throw new Error('Could not fetch user details');
                }

                const userDetailsData = await userDetailsResponse.json();
                setUserDetails(userDetailsData);
            } catch (error) {
                console.error('Profile fetch error:', error);
            }

            // Fetch user appointments
            try {
                const userId = localStorage.getItem('userId'); // Make sure the userId is stored in localStorage upon login
                const appointmentsResponse = await fetch(`http://localhost:3360/appointments/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!appointmentsResponse.ok) {
                    throw new Error('Could not fetch appointments');
                }

                const appointmentsData = await appointmentsResponse.json();
                setAppointments(appointmentsData);
            } catch (error) {
                console.error('Appointments fetch error:', error);
            }
        };

        fetchUserDetailsAndAppointments();
    }, [navigate]);

    const handleDeleteAppointment = async (appointmentId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3360/appointments/cancel/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remove the deleted appointment from state
                setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
                alert('Appointment cancelled successfully.');
            } else {
                throw new Error('Could not cancel the appointment.');
            }
        } catch (error) {
            console.error('Delete appointment error:', error);
            alert(error.message);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`http://localhost:3360/api/auth/upload-profile-image`, {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        const updatedUserDetails = await response.json();
        setUserDetails(updatedUserDetails);
    };

    useEffect(() => {
        const fetchAppointments = async (role, userId, token) => {
            let url;
            if (role === 'doctor') {
                url = `http://localhost:3360/appointments/doctor/${userId}`;
            } else {
                url = `http://localhost:3360/appointments/user/${userId}`;
            }

            try {
                const appointmentsResponse = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!appointmentsResponse.ok) {
                    throw new Error('Could not fetch appointments');
                }

                const appointmentsData = await appointmentsResponse.json();
                setAppointments(appointmentsData);
            } catch (error) {
                console.error('Appointments fetch error:', error);
            }
        };

        if (userDetails.role) {
            fetchAppointments(userDetails.role, localStorage.getItem('userId'), localStorage.getItem('token'));
        }
    }, [userDetails.role, navigate]);


    return (
        <div className="profile-container">
            <h2 className="profile-title">User Profile</h2>
            <div className="profile-info">Email: {userDetails.email}</div>
            <div className="profile-info">Username: {userDetails.username}</div>
            <div className="profile-info">City: {userDetails.city}</div>
            <div className="profile-info">Region: {userDetails.region}</div>
            <div className="profile-info">Type: {userDetails.role}</div>
            <div className="profile-info">Phone Number: {userDetails.phoneNumber}</div>

            <img src={userDetails.imageUrl || 'http://localhost:3360/images/default-profile.png'} alt="Profile" className="profile-image"/>
            <input type="file" onChange={handleImageUpload} />
            <h3>Appointments</h3>
            <ul className="appointments-list">
                {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <li key={appointment.id} className="appointment-item">
                            Appointment with Dr. {appointment.doctorName} at {appointment.clinicName} on {format(new Date(appointment.date + 'T' + appointment.time), 'PPPPp')} located at {appointment.location}.
                            <button onClick={() => handleDeleteAppointment(appointment.id)} className="appointment-button">Cancel</button>
                        </li>
                    ))
                ) : (
                    <p>No appointments found.</p>
                )}
            </ul>
        </div>
    );
};

export default ProfilePage;
