import React, { useState, useEffect } from 'react';
import './AnnouncementBar.css';

const announcements = [
    "DELIVERY IN 3-5 WORKING DAYS",
    "14 DAYS EASY RETURN & EXCHANGE"
];

const AnnouncementBar = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="announcement-bar">
            <div className="container text-center">
                <p className="announcement-text fade-in">
                    {announcements[currentIndex]}
                </p>
            </div>
        </div>
    );
};

export default AnnouncementBar;
