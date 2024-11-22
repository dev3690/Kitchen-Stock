// jsx:src/pages/LoginPage.jsx
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';
import { useNavigate } from "react-router-dom";

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

function LoginPage({ language }) {
    // const { isAuthenticated, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if () {
    //         navigate("/dashboard");
    //     }
    //   }, []);
    

    return (
        <div className="login-container">
            <div className="login-image" >
                <img src="/assets/loginphoto.png" alt="Decorative temple"  />
            </div>
            <div className="login-form-container">
                <LoginForm language={language} 
                //  onLogin={(token, role) => login(token, role)} 
                 />
            </div>
        </div>  
    );
}

export default LoginPage;
