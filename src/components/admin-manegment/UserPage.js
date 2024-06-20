import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserPage() {
    const [users, setUsers] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [filterRole, setFilterRole] = useState('');  // State to hold the current role filter
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        city: '',
        region: '',
        phoneNumber: '',
        role: '',
        clinicId: '',
        specialtyId: '',
        age: ''  // Added age state
    });

    useEffect(() => {
        fetchData();
        fetchClinicsAndSpecialties();
    }, []);

    const fetchData = async () => {
        const response = await axios.get('http://localhost:3360/admin/users', { headers: authHeader() });
        setUsers(response.data);
    };

    const fetchClinicsAndSpecialties = async () => {
        const clinicsResponse = await axios.get('http://localhost:3360/admin/clinics', { headers: authHeader() });
        const specialtiesResponse = await axios.get('http://localhost:3360/admin/specialties', { headers: authHeader() });
        setClinics(clinicsResponse.data);
        setSpecialties(specialtiesResponse.data);
    };

    const authHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleAdd = async () => {
        if (!form.city || form.city.trim() === '') {
            console.error('Город обязателен для заполнения');
            return;
        }
        try {
            await axios.post('http://localhost:3360/admin/users', form, { headers: authHeader() });
            fetchData();
            setForm({ username: '', email: '', password: '', city: '', region: '', phoneNumber: '', role: '', clinicId: '', specialtyId: '' });
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3360/admin/users/${id}`, { headers: authHeader() });
            fetchData();
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:3360/admin/users/${id}`, form, { headers: authHeader() });
            fetchData();
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterChange = (event) => {
        setFilterRole(event.target.value);
    };

    // Filter users based on the selected role
    const filteredUsers = filterRole ? users.filter(user => user.role === filterRole) : users;

    return (
        <div>
            <h1>Управление пользователями</h1>
            <div>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Имя пользователя" />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Пароль" />
                <input name="city" value={form.city} onChange={handleChange} placeholder="Город" />
                <input name="region" value={form.region} onChange={handleChange} placeholder="Регион" />
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Номер телефона" />
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Возраст" min="18" />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="">Выберите роль</option>
                    <option value="user">Пользователь</option>
                    <option value="doctor">Врач</option>
                    <option value="admin">Администратор</option>
                </select>
                {form.role === 'doctor' && (
                    <>
                        <select name="clinicId" value={form.clinicId} onChange={handleChange}>
                            <option value="">Выберите клинику</option>
                            {clinics.map(clinic => (
                                <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                            ))}
                        </select>
                        <select name="specialtyId" value={form.specialtyId} onChange={handleChange}>
                            <option value="">Выберите специальность</option>
                            {specialties.map(specialty => (
                                <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                            ))}
                        </select>
                    </>
                )}
                <button onClick={handleAdd}>Добавить пользователя</button>
                <select onChange={handleFilterChange} value={filterRole}>
                    <option value="">Все роли</option>
                    <option value="user">Пользователи</option>
                    <option value="doctor">Врачи</option>
                    <option value="admin">Администраторы</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Email</th>
                        <th>Город</th>
                        <th>Регион</th>
                        <th>Телефон</th>
                        <th>Роль</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                            <td>{user.region}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>Удалить</button>
                                <button onClick={() => handleUpdate(user.id)}>Обновить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserPage;
