import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SpecialtyPage() {
    const [specialties, setSpecialties] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [form, setForm] = useState({ name: '', clinicIds: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchClinics();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3360/admin/specialties', { headers: authHeader() });
            setSpecialties(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о специальностях:', error);
            setError('Не удалось получить данные о специальностях.');
        }
        setLoading(false);
    };

    const fetchClinics = async () => {
        try {
            const response = await axios.get('http://localhost:3360/admin/clinics', { headers: authHeader() });
            setClinics(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о клиниках:', error);
            setError('Не удалось получить данные о клиниках.');
        }
    };

    const authHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleSave = async () => {
        if (!form.name || !form.clinicIds.length) {
            setError('Все поля обязательны для заполнения.');
            return;
        }

        try {
            const method = editingId ? 'put' : 'post';
            const url = editingId ? `http://localhost:3360/admin/specialties/${editingId}` : 'http://localhost:3360/admin/specialties';
            await axios[method](url, { name: form.name, clinicIds: form.clinicIds }, { headers: authHeader() });
            fetchData();
            setForm({ name: '', clinicIds: [] });
            setEditingId(null);
        } catch (error) {
            console.error('Ошибка при сохранении специальности:', error);
            setError('Не удалось сохранить специальность.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3360/admin/specialties/${id}`, { headers: authHeader() });
            fetchData();
        } catch (error) {
            console.error('Ошибка при удалении специальности:', error);
            setError('Не удалось удалить специальность.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleClinicChange = (event) => {
        const { value } = event.target;
        setForm(prevForm => ({
            ...prevForm,
            clinicIds: [value] // Assuming single selection for now
        }));
    };

    const handleEdit = (id) => {
        const specialty = specialties.find(s => s.id === id);
        setForm({
            name: specialty.name,
            clinicIds: specialty.clinicIds
        });
        setEditingId(id);
    };

    return (
        <div>
            <h1>Управление специальностями</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <p>Загрузка...</p> : (
                <div>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Название" />
                    <select value={form.clinicIds[0] || ''} onChange={handleClinicChange}>
                        <option value="">Выберите клинику</option>
                        {clinics.map(clinic => (
                            <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                        ))}
                    </select>
                    <button onClick={handleSave}>{editingId ? 'Обновить специальность' : 'Добавить специальность'}</button>
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Клиника</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {specialties.map(specialty => (
                        <tr key={specialty.id}>
                            <td>{specialty.id}</td>
                            <td>{specialty.name}</td>
                            <td>{specialty.clinicIds.join(', ') || 'Нет'}</td>
                            <td>
                                <button onClick={() => handleDelete(specialty.id)}>Удалить</button>
                                <button onClick={() => handleEdit(specialty.id)}>Редактировать</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SpecialtyPage;
