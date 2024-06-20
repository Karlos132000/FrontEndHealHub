import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import '../styles/ProfilePage.css';

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
                    throw new Error('Не удалось получить данные пользователя');
                }

                const userDetailsData = await userDetailsResponse.json();
                setUserDetails(userDetailsData);
            } catch (error) {
                console.error('Ошибка получения данных профиля:', error);
            }

            const userId = localStorage.getItem('userId');
            const url = userDetails.role === 'doctor' ? `http://localhost:3360/appointments/doctor/${userId}` : `http://localhost:3360/appointments/user/${userId}`;
            try {
                const appointmentsResponse = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!appointmentsResponse.ok) {
                    throw new Error('Не удалось получить записи');
                }

                const appointmentsData = await appointmentsResponse.json();
                setAppointments(appointmentsData);
            } catch (error) {
                console.error('Ошибка получения записей:', error);
            }
        };

        fetchUserDetailsAndAppointments();
    }, [navigate, userDetails.role]);

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
                setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
                alert('Запись успешно отменена.');
            } else {
                throw new Error('Не удалось отменить запись.');
            }
        } catch (error) {
            console.error('Ошибка отмены записи:', error);
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
            throw new Error('Не удалось загрузить изображение');
        }
        const updatedUserDetails = await response.json();
        setUserDetails(updatedUserDetails);
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">Профиль пользователя</h2>
            <img src={userDetails.imageUrl || 'http://localhost:3360/images/default-profile.png'} alt="Profile" className="profile-image" />
            <input type="file" onChange={handleImageUpload} />

            <div className="profile-info">Email: {userDetails.email}</div>
            <div className="profile-info">Имя: {userDetails.username}</div>
            <div className="profile-info">Город: {userDetails.city}</div>
            <div className="profile-info">Регион: {userDetails.region}</div>
            <div className="profile-info">Возраст: {userDetails.age}</div> {/* Добавлен возраст */}
            <div className="profile-info">Тип: {userDetails.role}</div>
            <div className="profile-info">Номер телефона: {userDetails.phoneNumber}</div>

            <h3 className="appointments-title">Записи</h3>
            <div className="appointments-container">
                {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-details">
                                <div className="appointment-doctor">Доктор: {appointment.doctorName}</div>
                                <div className="appointment-clinic">Клиника: {appointment.clinicName}</div>
                                <div className="appointment-date">
                                    {format(new Date(appointment.date + 'T' + appointment.time), 'PPPPp', { locale: ru })}
                                </div>
                                <div className="appointment-location">Место: {appointment.location}</div>
                            </div>
                            <div className="appointment-actions">
                                <button onClick={() => handleDeleteAppointment(appointment.id)} className="appointment-delete-button">
                                    Отменить
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Записи не найдены.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
