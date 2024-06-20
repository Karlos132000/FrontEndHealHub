import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({
        userId: '',
        doctorId: '',
        clinicId: '',
        specialtyId: '',
        dateTime: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3360/admin/appointments', { headers: authHeader() });
            setAppointments(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о приемах:', error);
        }
    };

    // Generate authorization header
    const authHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Handle adding a new appointment
    const handleAdd = async () => {
        if (!form.userId || !form.doctorId || !form.clinicId || !form.specialtyId) {
            alert('Все поля обязательны для заполнения.');
            return;
        }

        try {
            await axios.post('http://localhost:3360/admin/appointments', form, { headers: authHeader() });
            fetchData(); // Refresh the data
            setForm({ userId: '', doctorId: '', clinicId: '', specialtyId: '', dateTime: '' });
        } catch (error) {
            console.error('Ошибка при добавлении приема:', error);
        }
    };

    // Handle updating an existing appointment
    const handleUpdate = async (id) => {
        if (!form.userId || !form.doctorId || !form.clinicId || !form.specialtyId) {
            alert('Все поля обязательны для заполнения.');
            return;
        }

        try {
            await axios.put(`http://localhost:3360/admin/appointments/${id}`, form, { headers: authHeader() });
            fetchData(); // Refresh the data
        } catch (error) {
            console.error('Ошибка при обновлении приема:', error);
        }
    };

    // Handle deleting an appointment
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3360/admin/appointments/${id}`, { headers: authHeader() });
            fetchData(); // Refresh the data
        } catch (error) {
            console.error('Ошибка при удалении приема:', error);
        }
    };

    // Handle form changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <div>
            <h1>Управление приемами</h1>
            <div>
                <input name="userId" value={form.userId} onChange={handleChange} placeholder="ID пользователя" />
                <input name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="ID врача" />
                <input name="clinicId" value={form.clinicId} onChange={handleChange} placeholder="ID клиники" />
                <input name="specialtyId" value={form.specialtyId} onChange={handleChange} placeholder="ID специальности" />
                <input name="dateTime" value={form.dateTime} onChange={handleChange} placeholder="Дата и время" />
                <button onClick={handleAdd}>Добавить прием</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID пользователя</th>
                        <th>ID врача</th>
                        <th>ID клиники</th>
                        <th>ID специальности</th>
                        <th>Дата и время</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment.id}>
                            <td>{appointment.id}</td>
                            <td>{appointment.userId}</td>
                            <td>{appointment.doctorId}</td>
                            <td>{appointment.clinicId}</td>
                            <td>{appointment.specialtyId}</td>
                            <td>{appointment.dateTime}</td>
                            <td>
                                <button onClick={() => handleDelete(appointment.id)}>Удалить</button>
                                <button onClick={() => handleUpdate(appointment.id)}>Обновить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AppointmentPage;
