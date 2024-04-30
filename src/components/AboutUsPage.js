import React, { useState } from 'react';
import '../styles/AboutUsPage.css'; // Make sure you have this CSS file created
import teamImage from '../assets/images/3635297.png'; // Adjust the path as necessary
import additionalImage from '../assets/images/3740749.png'; // Path for the new image that will be shown after clicking 'Read More'

const AboutUsPage = () => {
    const [showMore, setShowMore] = useState(false);

    const toggleReadMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className="about-page">
            <div className="about-section">
                <div className="about-text">
                    <h1 className="about-title">Кто мы</h1>
                    <p className="about-description"> HealHub - это онлайн-платформа, призванная упростить процесс записи на прием к врачу, предлагая пользователям удобство, гибкость и доступ к качественным медицинским услугам. С помощью HealHub пользователи могут легко искать поставщиков медицинских услуг по их специализации, выбирать предпочтительных врачей и записываться на прием в удобное для них время,
                        не выходя из дома. Благодаря нашему сайту, пациенты могут найти всю необходимую им помощь в нужное время..</p>
                    <p className="about-description">Как работает HealHub:

                        Выберите специальность, просмотрите квалифицированных врачей по выбранной вами специальности, после чего забронируйте прием..</p>
                    <button className="about-read-more" onClick={toggleReadMore}>
                        {showMore ? 'Читайте меньше' : 'Читать далее'}
                    </button>
                </div>
                <div className="about-image">
                    <img src={teamImage} alt="Our Team" />
                </div>
            </div>
            {showMore && (
                <div className="additional-content">
                    <div className="additional-image">
                        <img src={additionalImage} alt="Additional Info" />
                    </div>
                    <div className="additional-text">
                        <h2>Присоединяйтесь к HealHub уже сегодня</h2>
                        <p>Оцените новый уровень удобства в сфере здравоохранения. Присоединяйтесь к HealHub и возьмите под контроль свой путь к здоровью с легкостью..</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutUsPage;
