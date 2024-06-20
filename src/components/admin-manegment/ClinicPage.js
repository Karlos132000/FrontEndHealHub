import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClinicPage() {
    const [clinics, setClinics] = useState([]);
    const [form, setForm] = useState({ name: '', city: '', region: '', latitude: '', longitude: '' });

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3360/admin/clinics', { headers: authHeader() });
            setClinics(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о клиниках:', error);
        }
    };

    // Generate authorization header
    const authHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Handle adding a new clinic
    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:3360/admin/clinics', form, { headers: authHeader() });
            fetchData(); // Refresh the data
        } catch (error) {
            console.error('Ошибка при добавлении клиники:', error);
        }
    };

    // Handle updating an existing clinic
    const handleUpdate = async (id) => {
        const payload = { ...form, id }; // Make sure 'id' is correctly passed
        try {
            await axios.put(`http://localhost:3360/admin/clinics/${id}`, payload, { headers: authHeader() });
            fetchData();
        } catch (error) {
            console.error('Ошибка при обновлении клиники:', error);
        }
    };

    // Handle deleting a clinic
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3360/admin/clinics/${id}`, { headers: authHeader() });
            fetchData(); // Refresh the data
        } catch (error) {
            console.error('Ошибка при удалении клиники:', error);
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
            <h1>Управление клиниками</h1>
            <div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Название" />
                <input name="city" value={form.city} onChange={handleChange} placeholder="Город" />
                <input name="region" value={form.region} onChange={handleChange} placeholder="Регион" />
                <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Широта" />
                <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Долгота" />
                <button onClick={handleAdd}>Добавить клинику</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Город</th>
                        <th>Регион</th>
                        <th>Широта</th>
                        <th>Долгота</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {clinics.map(clinic => (
                        <tr key={clinic.id}>
                            <td>{clinic.id}</td>
                            <td>{clinic.name}</td>
                            <td>{clinic.city}</td>
                            <td>{clinic.region}</td>
                            <td>{clinic.latitude}</td>
                            <td>{clinic.longitude}</td>
                            <td>
                                <button onClick={() => handleDelete(clinic.id)}>Удалить</button>
                                <button onClick={() => handleUpdate(clinic.id)}>Обновить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClinicPage;
