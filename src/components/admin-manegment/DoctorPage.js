import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorPage() {
    const [doctors, setDoctors] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        city: '',
        region: '',
        phoneNumber: '',
        role: 'doctor',
        clinicId: '',
        specialtyId: ''
    });

    useEffect(() => {
        fetchData();
        fetchClinicsAndSpecialties();
    }, []);

    const fetchData = async () => {
        const response = await axios.get('http://localhost:3360/admin/doctors', { headers: authHeader() });
        setDoctors(response.data);
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

    const handleAddOrUpdate = async () => {
        const method = selectedDoctor ? 'put' : 'post';
        const url = selectedDoctor ? `http://localhost:3360/admin/doctors/${selectedDoctor}` : 'http://localhost:3360/admin/doctors';

        if (!form.city || form.city.trim() === '') {
            console.error('Город обязателен для заполнения');
            return;
        }

        try {
            await axios[method](url, { ...form, type: 'doctor' }, { headers: authHeader() });
            fetchData();
            handleResetForm();
        } catch (error) {
            console.error('Ошибка при добавлении или обновлении врача:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3360/admin/doctors/${id}`, { headers: authHeader() });
            fetchData();
        } catch (error) {
            console.error('Ошибка при удалении врача:', error);
        }
    };

    const handleEdit = (doctor) => {
        setForm({
            username: doctor.user.username,
            email: doctor.user.email,
            password: '',
            city: doctor.user.city,
            region: doctor.user.region,
            phoneNumber: doctor.user.phoneNumber,
            clinicId: doctor.clinic.id,
            specialtyId: doctor.specialty.id,
            role: 'doctor'
        });
        setSelectedDoctor(doctor.id);
    };

    const handleResetForm = () => {
        setForm({
            username: '',
            email: '',
            password: '',
            city: '',
            region: '',
            phoneNumber: '',
            clinicId: '',
            specialtyId: '',
            role: 'doctor',
        });
        setSelectedDoctor(null);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h1>Управление врачами</h1>
            <div>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Имя пользователя" />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Пароль" />
                <input name="city" value={form.city} onChange={handleChange} placeholder="Город" />
                <input name="region" value={form.region} onChange={handleChange} placeholder="Регион" />
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Номер телефона" />
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
                <button onClick={handleAddOrUpdate}>{selectedDoctor ? 'Обновить врача' : 'Добавить врача'}</button>
                {selectedDoctor && <button onClick={handleResetForm}>Отменить обновление</button>}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Город</th>
                        <th>Регион</th>
                        <th>Телефон</th>
                        <th>Клиника</th>
                        <th>Специальность</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doctor => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.user.email}</td>
                            <td>{doctor.user.city}</td>
                            <td>{doctor.user.region}</td>
                            <td>{doctor.user.phoneNumber}</td>
                            <td>{doctor.clinic.name}</td>
                            <td>{doctor.specialty.name}</td>
                            <td>
                                <button onClick={() => handleEdit(doctor)}>Редактировать</button>
                                <button onClick={() => handleDelete(doctor.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DoctorPage;
