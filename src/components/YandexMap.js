import React, { useEffect, useRef } from 'react';

const YandexMap = ({ center, zoom, clinics, onSelectClinic }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const initMap = () => {
            if (window.ymaps && window.ymaps.ready) {
                window.ymaps.ready(() => {
                    try {
                        if (!mapRef.current) {
                            mapRef.current = new window.ymaps.Map('yandex-map', {
                                center,
                                zoom,
                            });

                            clinics.forEach((clinic) => {
                                const placemark = new window.ymaps.Placemark([clinic.latitude, clinic.longitude], {
                                    balloonContent: clinic.name,
                                });

                                placemark.events.add('click', () => {
                                    onSelectClinic(clinic);
                                });

                                mapRef.current.geoObjects.add(placemark);
                            });
                        }
                    } catch (error) {
                        console.error('Error creating Yandex map:', error);
                    }
                });
            }
        };

        if (!window.ymaps) {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
            script.onload = () => {
                window.ymaps.load(initMap);
            };
            document.body.appendChild(script);
        } else {
            initMap();
        }

        // Cleanup on component unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, [center, zoom, clinics, onSelectClinic]);

    return <div id="yandex-map" style={{ width: '100%', height: '500px' }} />;
};

export default YandexMap;
