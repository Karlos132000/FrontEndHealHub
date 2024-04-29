import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; // Import the new CSS file here
import medicalProfessionalsImage from '../assets/images/3635297.png'; // Import the image here


const HomePage = () => {
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of specialties from the backend
        const fetchSpecialties = async () => {
            try {
                const response = await fetch('http://localhost:3360/specialties');
                const data = await response.json();
                setSpecialties(data);
            } catch (error) {
                console.error("Failed to fetch specialties:", error);
            }
        };

        fetchSpecialties();
    }, []);

    const handleSpecialtyChange = (e) => {
        setSelectedSpecialty(e.target.value);
    };

// In the HomePage component
    const handleSearch = () => {
        // Find the specialty object from the selected specialty name
        const specialtyObject = specialties.find(s => s.name === selectedSpecialty);

        // Navigate to the booking page with the specialty ID as a URL parameter
        navigate(`/booking?specialty=${encodeURIComponent(specialtyObject.id)}`);
    };
    const AnimatedText = () => (
        <div className="animated-text-container">
            <p className="animated-text">Простая и быстрая запись к врач, Ваше здоровье наш приоритет.</p>
            <p className="animated-text">Простая и быстрая запись в клинику, Ваше здоровье наш приоритет.</p>
        </div>
    );

    return (
        <div className="new-home-container">
            <h1>Найдите специалиста</h1>
            <AnimatedText />

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Поиск специальности..."
                    value={selectedSpecialty}
                    onChange={handleSpecialtyChange}
                    list="specialty-list"
                />
                <datalist id="specialty-list">
                    {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.name} />
                    ))}
                </datalist>
                <button onClick={handleSearch}>Найти</button>
            </div>

            <img src={medicalProfessionalsImage} alt="Healthcare professionals" className="overview-image" />

        </div>
    );
};

export default HomePage;
