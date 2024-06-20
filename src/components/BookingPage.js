import 'leaflet/dist/leaflet.css';
import '../styles/BookingPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import LocationMarkerImage from '../images/LocationMarker.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import YandexMap from './YandexMap';
import React, { useState, useEffect, useContext } from 'react';
import { useAuth, AuthProvider } from './context/auth-context';

// Define your cities and regions mapping
const citiesWithRegions = {
    'Воронеж': ['Центральный', 'Советский', 'Левобережный', 'Ленинский'],
    'Санкт-Петербург': ['Выборгский', 'Адмиралтейский', 'Василеостровский', 'Калининский', 'Московский'],
    // ... more cities and regions
};

const formatDateTimeISO = (date, time) => {
    if (!date || !time) {
        throw new RangeError('Недействительная дата или время');
    }

    const [hours, minutes, seconds] = time.split(':');

    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours, 10));
    dateTime.setMinutes(parseInt(minutes, 10));
    dateTime.setSeconds(parseInt(seconds, 10));

    if (isNaN(dateTime.getTime())) {
        throw new RangeError('Недействительный формат даты');
    }
    console.log("Date:", date);
    console.log("Time:", time);
    return dateTime.toISOString();
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
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        console.log("User Logged In:", isLoggedIn);
        // Implement any logic that needs to run when isLoggedIn changes
    }, [isLoggedIn]);


    window.ym(97430458, 'reachGoal', 'BookAppointment');


    const query = new URLSearchParams(location.search);
    const specialtyQueryParam = query.get('specialty');

    const locationMarkerIcon = L.icon({
        iconUrl: LocationMarkerImage,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });

    useEffect(() => {
        if (specialtyQueryParam) {
            const specialtyId = specialtyQueryParam;
            setSelectedSpecialtyId(specialtyId);
        }
    }, [specialtyQueryParam]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3360/specialties');
                if (!response.ok) throw new Error('Проблема с получением специальностей');
                const data = await response.json();
                setSpecialties(data);
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
                if (!response.ok) throw new Error(`Не удалось получить врачей, статус: ${response.status}`);
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Не удалось получить врачей:', error);
                alert('Не удалось получить врачей: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, [selectedClinic]);

    useEffect(() => {
        const fetchClinics = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3360/clinics/search?specialtyId=${selectedSpecialtyId}&city=${encodeURIComponent(selectedCity)}&region=${encodeURIComponent(selectedRegion)}`);
                if (!response.ok) throw new Error('Проблема с получением клиник');
                let data = await response.json();
                data = data.filter(clinic => clinic.latitude != null && clinic.longitude != null);
                if (data.length > 0) {
                    setMapCenter([data[0].latitude, data[0].longitude]);
                }
                setClinics(data);
                console.log('Данные клиник:', data);
            } catch (error) {
                console.error('Ошибка при получении данных о клиниках:', error);
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

    const handleAppointmentTimeChange = (selectedDates, dateStr, instance) => {
        if (selectedDates.length > 0) {
            const time = selectedDates[0];
            const formattedTime = time.toTimeString().split(' ')[0];
            setAppointmentTime(formattedTime);
        } else {
            console.error('Время не выбрано');
        }
    };

    const handleClinicSelect = (clinic) => {
        setSelectedClinic(clinic.id);
        setMapCenter([clinic.latitude, clinic.longitude]);
        setShowMap(false); // Hide the map after selecting a clinic
    };

    const handleSearch = async () => {
        if (!selectedSpecialtyId || !selectedCity || !selectedRegion) {
            alert('Пожалуйста, выберите специальность, город и регион.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3360/clinics/search?specialtyId=${selectedSpecialtyId}&city=${encodeURIComponent(selectedCity)}&region=${encodeURIComponent(selectedRegion)}`);
            if (!response.ok) throw new Error('Проблема с получением клиник');
            const data = await response.json();
            setClinics(data);
            setShowMap(true);
        } catch (error) {
            console.error(error);
            alert('Не удалось получить клиники.');
            setShowMap(false);
        } finally {
            setIsLoading(false);
        }
    };

    const DoctorDetails = ({ doctor }) => {
        const [selectedDate, setSelectedDate] = useState('');
        const [selectedTime, setSelectedTime] = useState('');
        const { isLoggedIn } = useAuth(); // Using the custom hook to get auth status

        const handleDateChange = (e) => {
            setSelectedDate(e.target.value);
        };

        const handleTimeChange = (selectedDates, dateStr, instance) => {
            if (selectedDates.length > 0) {
                const time = selectedDates[0];
                const formattedTime = time.toTimeString().split(' ')[0];
                setSelectedTime(formattedTime);
            } else {
                console.error('Время не выбрано');
            }
        };

        const bookDoctorAppointment = async () => {
            if (!isLoggedIn) {
                console.error("Попытка записи без входа в систему.");
                alert("Вы должны войти в систему, чтобы записаться на прием.");
                return;
            }

            if (!selectedDate || !selectedTime) {
                alert('Пожалуйста, выберите дату и время для вашего приема.');
                return;
            }

            let combinedDateTime;
            try {
                combinedDateTime = formatDateTimeISO(selectedDate, selectedTime);
            } catch (error) {
                alert(error.message);
                return;
            }

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
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' // Ensure to accept JSON responses
                    },
                    credentials: 'include', // Important if cookies are involved
                    body: JSON.stringify(appointmentDetails),
                });

                if (!response.ok) {
                    const errorDetails = await response.json(); // Parsing the JSON response body
                    throw new Error('Проблема с бронированием приема: ' + errorDetails.message); // Custom message using server response
                }

                alert('успешно забронировано!!');
            } catch (error) {
                console.error('Ошибка при бронировании приема:', error);
                alert('Не удалось забронировать прием: ' + error.message); // More descriptive error message
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
                                    value={selectedTime}
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
            {
                !isLoading && doctors.length > 0 && (
                    doctors.map(doctor => (
                        <DoctorDetails key={doctor.id} doctor={doctor} />
                    ))
                )
            }
            {
                showMap && (
                    <YandexMap
                        center={mapCenter}
                        zoom={13}
                        clinics={clinics}
                        onSelectClinic={handleClinicSelect}
                    />
                )
            }
        </div>
    );
};

export default BookingPage;
