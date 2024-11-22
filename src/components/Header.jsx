import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { FaArrowLeft } from 'react-icons/fa';

function Header({ currentLanguage, handleLanguageChange }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate('/login');
    };

    const showBackButton = location.pathname !== '/dashboard';

    return (
        <div className="dashboard-header">
            {showBackButton && (
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft />
                </button>
            )}
            <h1 className="dashboard-header-name">Kitchen Stock</h1>
            <div className="header-icons right-icons">
                <button className="icon-button" onClick={() => navigate('/reports')}>
                    <img
                        src="/assets/reports.png"
                        alt="Reports"
                        className="icon"
                    />
                </button>
                <button className="icon-button" onClick={handleLanguageChange}>
                    <img
                        src="/assets/languages.png"
                        alt="Change Language"
                        className="icon"
                    />
                </button>
                <button className="icon-button" onClick={handleLogout}>
                    <img src="/assets/logout.png" alt="Logout" className="icon" />
                </button>
            </div>
        </div>
    );
}

export default Header;
