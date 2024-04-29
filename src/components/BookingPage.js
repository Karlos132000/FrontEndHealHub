import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/BookingPage.css'; // Import the new CSS file here
import { useLocation, useNavigate } from 'react-router-dom';




// Define your cities and regions mapping
const citiesWithRegions = {
    'Воронеж': ['Центральный', 'Советский', 'Левобережный', 'Ленинский'],
    'Санкт-Петербург': ['Выборгский', 'Адмиралтейский', 'Василеостровский', 'Калининский', 'Московский'],
    // ... more cities and regions
};



const BookingPage = () => {
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [clinics, setClinics] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([51.6664, 39.1936]);
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const specialtyQueryParam = query.get('specialty');

    useEffect(() => {
        if (specialtyQueryParam) {
            // Make sure to set the specialty ID correctly, if it needs to be an integer you might need to convert it
            const specialtyId = specialtyQueryParam; // If IDs are numbers, use: parseInt(specialtyQueryParam, 10)
            setSelectedSpecialtyId(specialtyId);
        }
    }, [specialtyQueryParam]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3360/specialties');
                if (!response.ok) throw new Error('Problem fetching specialties');
                const data = await response.json();
                setSpecialties(data);

                // After fetching, check if the URL parameter matches any fetched specialty ID
                const specialtyFromParam = data.find(s => s.id.toString() === specialtyQueryParam);
                if (specialtyFromParam) {
                    setSelectedSpecialtyId(specialtyFromParam.id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecialties();
    }, [specialtyQueryParam]);


    useEffect(() => {
        setRegions(citiesWithRegions[selectedCity] || []);
        setSelectedRegion('');
        setSelectedClinic('');
        setDoctors([]);
    }, [selectedCity]);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!selectedClinic) {
                setDoctors([]);
                return;
            }
            setIsLoading(true);
            const url = `http://localhost:3360/doctors?clinicId=${encodeURIComponent(selectedClinic)}`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch doctors, status: ${response.status}`);
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
                alert('Не удалось получить врачей: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, [selectedClinic]);

    // Ensure useEffect runs only when selectedClinic changes

    useEffect(() => {
        const fetchClinics = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3360/clinics/search?specialtyId=${selectedSpecialtyId}&city=${encodeURIComponent(selectedCity)}&region=${encodeURIComponent(selectedRegion)}`);
                if (!response.ok) throw new Error('Problem fetching clinics');
                let data = await response.json();
                // Filter out clinics without valid latitude and longitude
                data = data.filter(clinic => clinic.latitude != null && clinic.longitude != null);
                if (data.length > 0) {
                    setMapCenter([data[0].latitude, data[0].longitude]);
                }
                setClinics(data);
                console.log('Clinics Data:', data);  // Check the console to see what data is being loaded
                setClinics(data);
            } catch (error) {
                console.error('Error fetching clinics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedSpecialtyId && selectedCity && selectedRegion) {
            fetchClinics();
        }
    }, [selectedSpecialtyId, selectedCity, selectedRegion]);



    const handleSpecialtyChange = (e) => {
        setSelectedSpecialtyId(e.target.value);
        // Add query parameter to URL when specialty is changed
        navigate(`?specialty=${e.target.value}`);
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
    };

    const handleClinicChange = (e) => {

        setSelectedClinic(e.target.value);
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
    };

    const handleAppointmentDateChange = (e) => {
        setAppointmentDate(e.target.value);
    };

    const handleAppointmentTimeChange = (e) => {
        setAppointmentTime(e.target.value);
    };

    // const [mapCenter, setMapCenter] = useState([50.5, 30.5]); // Default center

    const handleClinicSelect = (clinic) => {
        setSelectedClinic(clinic.id); // Make sure this is a number or string ID
        setMapCenter([clinic.latitude, clinic.longitude]);
    };
    // clinicId
    // clinic.id

    const handleSearch = async () => {
        if (!selectedSpecialtyId || !selectedCity || !selectedRegion) {
            alert('Пожалуйста, выберите специальность, город и регион.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3360/clinics/search?specialtyId=${selectedSpecialtyId}&city=${encodeURIComponent(selectedCity)}&region=${encodeURIComponent(selectedRegion)}`);
            if (!response.ok) throw new Error('Problem fetching clinics');
            const data = await response.json();
            setClinics(data);
            setShowMap(true); // Show the map as clinics are fetched
        } catch (error) {
            console.error(error);
            alert('Не удалось получить клиники.');
            setShowMap(false); // Hide the map on error
        } finally {
            setIsLoading(false);
        }
    };

    const bookAppointment = async () => {
        if (!selectedDoctor || !appointmentDate || !appointmentTime) {
            alert('Пожалуйста, выберите врача, дату и время приема.');

            return;
        }

        const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
        const combinedDateTime = `${formattedDate}T${appointmentTime}`;

        const appointmentDetails = {
            doctorId: selectedDoctor,
            userId: localStorage.getItem('userId'),
            clinicId: selectedClinic,
            specialtyId: selectedSpecialtyId,
            dateTime: combinedDateTime,
        };
        console.log("Appointment Details:", appointmentDetails);


        try {
            const response = await fetch('http://localhost:3360/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentDetails),
            });

            if (!response.ok) {
                throw new Error('Problem booking appointment');
            }
            alert('успешно забронировано!');
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Не удалось записаться на прием.');
        }
    };

    const DoctorDetails = ({ doctor }) => {
        const [selectedDate, setSelectedDate] = useState('');
        const [selectedTime, setSelectedTime] = useState('');

        // Correctly scoped date selection handler
        const handleDateChange = (e) => {
            setSelectedDate(e.target.value);
        };

        // Correctly scoped time selection handler
        const handleTimeChange = (e) => {
            setSelectedTime(e.target.value);
        };


        const bookDoctorAppointment = async () => {
            if (!selectedDate || !selectedTime) {
                alert('Пожалуйста, выберите дату и время для встречи.');
                return;
            }

            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
            const combinedDateTime = `${formattedDate}T${selectedTime}`;



            const appointmentDetails = {
                doctorId: doctor.id, // Here, you'll use the doctor's id from the doctor prop
                userId: localStorage.getItem('userId'), // You might be managing user state differently
                clinicId: doctor.clinic.id, // Adjust this to how you're storing clinic data
                specialtyId: doctor.specialty.id, // Adjust this to how you're storing specialty data
                dateTime: combinedDateTime,
            };

            console.log("Appointment Details:", appointmentDetails);

            try {
                const response = await fetch('http://localhost:3360/appointments/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentDetails),
                });

                if (!response.ok) {
                    throw new Error('Problem booking appointment');
                }

                alert('успешно забронировано');
            } catch (error) {
                console.error('Error booking appointment:', error);
                alert('Не удалось записаться на прием.');
            }


        };
        return (
            <div className="doctor-details-container">
                <div className="doctor-profile">
                    <img src={doctor.user.imageUrl} alt={doctor.name} className="doctor-image" />
                    <div className="doctor-info">
                        <h2>{doctor.name}</h2>
                        <p>Specialty: {doctor.specialty.name}</p>
                        <p>Clinic: {doctor.clinic.name}</p>
                        <p>Contact: {doctor.user.email}</p>
                        <div className="booking-container">
                            <div className="date-picker-container">
                                <label htmlFor="appointment-date">Choose a date:</label>
                                <input
                                    id="appointment-date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div className="time-picker-container">
                                <label htmlFor="appointment-time">Choose a time:</label>
                                <input
                                    id="appointment-time"
                                    type="time"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    step="1800" // This makes time options in 30 minutes interval
                                />
                            </div>
                            <button onClick={bookDoctorAppointment}>Book Appointment</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="home-container">

            <h1 className="home-title">Добро пожаловать в нашу систему бронирования медицинских назначений</h1>

            <div className="select-container">
                <select value={selectedSpecialtyId} onChange={handleSpecialtyChange}>
                    <option value="">Выберите специальность</option>
                    {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                            {specialty.name}
                        </option>
                    ))}
                </select>


                <select value={selectedCity} onChange={handleCityChange}>
                    <option value="">Выберите город</option>
                    {Object.keys(citiesWithRegions).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                {selectedCity && (
                    <select value={selectedRegion} onChange={handleRegionChange}>
                        <option value="">Select Region</option>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                )}

                <button onClick={handleSearch} disabled={isLoading}>Поиск клиник</button>
            </div>

            {/*{!isLoading && clinics.length > 0 && (*/}
            {/*    <div className="select-container">*/}
            {/*        <select value={selectedClinic} onChange={handleClinicChange}>*/}
            {/*            <option value="">Choose a Clinic</option>*/}
            {/*            {clinics.map(clinic => (*/}
            {/*                <option key={clinic.id} value={clinic.id}>{clinic.name}</option>*/}
            {/*            ))}*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*)}*/}

            {!isLoading && doctors.length > 0 && (
                doctors.map(doctor => (
                    <DoctorDetails key={doctor.id} doctor={doctor} />
                ))
            )}

            {/*{!isLoading && doctors.length > 0 && (*/}
            {/*    <div className="select-container">*/}
            {/*        <select value={selectedDoctor} onChange={handleDoctorChange}>*/}
            {/*            <option value="">Select a Doctor</option>*/}
            {/*            {doctors.map(doctor => (*/}
            {/*                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>*/}
            {/*            ))}*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/*<div className="date-time-container">*/}
            {/*    <input type="date" value={appointmentDate} onChange={handleAppointmentDateChange} />*/}
            {/*    <input type="time" value={appointmentTime} onChange={handleAppointmentTimeChange} />*/}
            {/*</div>*/}

            {/*<button onClick={bookAppointment}>Book Appointment</button>*/}
            {/*{isLoading && <p>Loading...</p>}*/}
            {/*{!isLoading && !clinics.length && !selectedClinic && <p>No clinics found for the selected specialty and location, or not yet searched.</p>}*/}
            {/*{!isLoading && !doctors.length && selectedClinic && <p>No doctors found in the selected clinic.</p>}*/}

            {showMap && (
                <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {clinics.map(clinic => (
                        clinic.latitude && clinic.longitude && (
                            <Marker key={clinic.id} position={[clinic.latitude, clinic.longitude]}>
                                <Popup>
                                    <div>
                                        <strong>{clinic.name}</strong>
                                        <div>{clinic.city}, {clinic.region}</div>
                                        <button onClick={() => handleClinicSelect(clinic)}>Select This Clinic</button>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
            )}
        </div>
    );
};

export default BookingPage

;
