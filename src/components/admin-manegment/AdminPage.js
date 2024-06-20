import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminPage.css';
import userImage from '../../images/find-person-job-opportunity_24877-63457.jpg';
import clinicImage from '../../images/patient-being-examined-by-doctor-clinic_23-2148866845.jpg';
import appointmentsImage from '../../images/man-holding-clock-time-management-concept_23-2148823171.jpg';
import specialtiesImage from '../../images/patient-being-examined-by-doctor-clinic_23-2148866845.jpg';
import doctorImage from '../../images/health-professional-team-collection_23-2148485546.jpg';

function AdminPage() {
    return (
        <div className="admin-dashboard">
            <h1>Панель администратора</h1>
            <div className="admin-cards">
                <Link to="/admin/users" className="admin-card">
                    <img src={userImage} alt="Управление пользователями" />
                    <span>Управление пользователями</span>
                </Link>
                <Link to="/admin/clinics" className="admin-card">
                    <img src={clinicImage} alt="Управление клиниками" />
                    <span>Управление клиниками</span>
                </Link>
                <Link to="/admin/appointments" className="admin-card">
                    <img src={appointmentsImage} alt="Управление приемами" />
                    <span>Управление приемами</span>
                </Link>
                <Link to="/admin/doctors" className="admin-card">
                    <img src={doctorImage} alt="Управление врачами" />
                    <span>Управление врачами</span>
                </Link>
                <Link to="/admin/specialties" className="admin-card">
                    <img src={specialtiesImage} alt="Управление специальностями" />
                    <span>Управление специальностями</span>
                </Link>
            </div>
        </div>
    );
}

export default AdminPage;
