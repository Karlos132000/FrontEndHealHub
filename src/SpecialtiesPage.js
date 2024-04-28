import React, { useState, useEffect } from 'react';


const citiesWithRegions = {
    'Воронеж': ['Центральный', 'Советский', 'Левобережный', 'Ленинский'],
    'Санкт-Петербург': ['Выборгский', 'Адмиралтейский', 'Василеостровский', 'Калининский', 'Московский'],
    // ... add other cities and their regions as needed
};

const SpecialtiesPage = () => {
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [clinics, setClinics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await fetch('http://localhost:3360/specialties', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch specialties, status: ${response.status}`);
                }

                const data = await response.json();
                setSpecialties(data);
            } catch (error) {
                console.error('Failed to fetch specialties:', error);
            }
            setIsLoading(false);
        };

        fetchSpecialties();
    }, []);

    useEffect(() => {
        setRegions(citiesWithRegions[selectedCity] || []);
        setSelectedRegion('');
    }, [selectedCity]);

    const handleSearchClinics = async () => {
        if (!selectedSpecialtyId || !selectedCity || !selectedRegion) {
            alert("Please select a specialty, city, and region to search.");
            return;
        }

        setSearchPerformed(true);
        try {
            const response = await fetch(
                `http://localhost:3360/clinics/search?specialtyId=${selectedSpecialtyId}&city=${encodeURIComponent(selectedCity)}&region=${encodeURIComponent(selectedRegion)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // If your API requires authentication, make sure to include the token in the header
                        // 'Authorization': 'Bearer ' + yourTokenVariable,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch clinics, status: ${response.status}`);
            }

            const data = await response.json();
            setClinics(data);
        } catch (error) {
            console.error('Failed to fetch clinics:', error);
            setClinics([]);
        }
    };

    return (
        <div>
            <h2>Specialties</h2>
            <div>
                <select value={selectedSpecialtyId} onChange={(e) => setSelectedSpecialtyId(e.target.value)}>
                    <option value="">Select a Specialty</option>
                    {specialties.map(specialty => (
                        <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                    ))}
                </select>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">Select City</option>
                    {Object.keys(citiesWithRegions).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {selectedCity && (
                    <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                        <option value="">Select Region</option>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                )}
                <button onClick={handleSearchClinics}>Search Clinics</button>
            </div>
            {clinics.length > 0 ? (
                <div>
                    <h3>Clinics Offering Selected Specialty:</h3>
                    <ul>
                        {clinics.map(clinic => (
                            <li key={clinic.id}>{clinic.name} - {clinic.city}, {clinic.region}</li>
                        ))}
                    </ul>
                </div>
            ) : searchPerformed && <p>No clinics found for the selected specialty and location.</p>}
            {isLoading && <p>Loading specialties...</p>}
        </div>
    );
};

export default SpecialtiesPage;
