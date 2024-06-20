import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css'; // Убедитесь, что файл CSS правильно подключен

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
        age: '', // Добавлен возраст пользователя
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
        // Проверка возраста на клиентской стороне
        if (parseInt(formData.age, 10) < 18) {
            alert('Вы должны быть не младше 18 лет для регистрации.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3360/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                navigate('/login');
            } else {
                alert('Регистрация не удалась. Пожалуйста, попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Регистрация не удалась из-за сетевой ошибки.');
        }

        window.ym(97430458, 'reachGoal', 'Register');

    };

    return (
        <div className="register-container">
            <h2 className="register-title">Регистрация</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Имя пользователя" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
                <input type="text" name="city" placeholder="Город" value={formData.city} onChange={handleChange} required />
                <input type="text" name="region" placeholder="Регион" value={formData.region} onChange={handleChange} required />
                <input type="tel" name="phoneNumber" placeholder="Номер телефона" value={formData.phoneNumber} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Возраст" value={formData.age} onChange={handleChange} required min="18" />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegisterPage;
