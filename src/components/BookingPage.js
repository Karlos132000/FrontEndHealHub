import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/BookingPage.css'; // Import the new CSS file here
import { useLocation, useNavigate } from 'react-router-dom';
import LocationMarkerImage from '../assets/images/LocationMarker.png';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library
import Flatpickr from 'react-flatpickr';

import 'flatpickr/dist/flatpickr.min.css'; // Make sure you import the CSS


// Define your cities and regions mapping
const citiesWithRegions = {
    'Воронеж': ['Центральный', 'Советский', 'Левобережный', 'Ленинский'],
    'Санкт-Петербург': ['Выборгский', 'Адмиралтейский', 'Василеостровский', 'Калининский', 'Московский'],
    // ... more cities and regions
};

const formatTime24Hour = (timeString) => {
    const time = new Date('1970-01-01T' + timeString + 'Z');
    return time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDateToRussian = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

    const locationMarkerIcon = L.icon({
        iconUrl: LocationMarkerImage,
        iconSize: [32, 32], // Set the size of the marker icon
        iconAnchor: [16, 32], // Set the anchor point of the marker icon
    });

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
                alert('Failed to fetch doctors: ' + error.message);
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
        // Convert input time to 24-hour format immediately or before using it
        const formattedTime = formatTime24Hour(e.target.value);
        setAppointmentTime(formattedTime);
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
            alert('Please select a specialty, city, and region.');
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
            alert('Failed to fetch clinics.');
            setShowMap(false); // Hide the map on error
        } finally {
            setIsLoading(false);
        }
    };

    const bookAppointment = async () => {
        if (!selectedDoctor || !appointmentDate || !appointmentTime) {
            alert('Please select a doctor, date, and time for your appointment.');

            return;
        }

        const formattedDate = new Date(appointmentDate).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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
            alert(' успешно забронировано!!');
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment.');
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
                alert('Please select a date and time for your appointment.');
                return;
            }

            const formattedDate = formatDateToRussian(selectedDate);
            const formattedTime = formatTime24Hour(selectedTime); // Ensure time is in 24-hour format
            const combinedDateTime = `${formattedDate}T${formattedTime}`;

            const appointmentDetails = {
                doctorId: doctor.id,
                userId: localStorage.getItem('userId'),
                clinicId: doctor.clinic.id,
                specialtyId: doctor.specialty.id,
                dateTime: combinedDateTime,
            };

            try {
                const response = await fetch('http://localhost:3360/appointments/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentDetails),
                });

                if (!response.ok) {
                    throw new Error('Problem booking appointment');
                }

                alert('успешно забронировано!!');
            } catch (error) {
                console.error('Error booking appointment:', error);
                alert('Failed to book appointment.');
            }
        };

        return (
            <div className="doctor-details-container">
                <div className="doctor-profile">
                    <img src={doctor.user.imageUrl} alt={doctor.name} className="doctor-image" />
                    <div className="doctor-info">
                        <h2>{doctor.name}</h2>
                        <p>Специализация: {doctor.specialty.name}</p>
                        <p>Клиника: {doctor.clinic.name}</p>
                        <p>Email: {doctor.user.email}</p>
                        <div className="booking-container">
                            <div className="date-picker-container">
                                <label htmlFor="appointment-date">Выберите дату:</label>
                                <input
                                    id="appointment-date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div className="time-picker-container">
                                <label htmlFor="appointment-time">Выберите время:</label>
                                <Flatpickr
                                    data-enable-time
                                    value={appointmentTime}
                                    onChange={handleTimeChange}
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true
                                    }}
                                />
                            </div>
                            <button onClick={bookDoctorAppointment}>Записаться на прием</button>
                        </div>
                    </div>
                </div>
            </div>
        );


    };

    return (
        <div className="home-container">

            <h1 className="home-title">Записаться на прием</h1>

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
                        <option value="">Выберите регион</option>
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
                            <Marker key={clinic.id} position={[clinic.latitude, clinic.longitude]} icon={locationMarkerIcon}>
                                <Popup>
                                    <div>
                                        <strong>{clinic.name}</strong>
                                        <div>{clinic.city}, {clinic.region}</div>
                                        <button onClick={() => handleClinicSelect(clinic)}>Выберите эту клинику</button>
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
