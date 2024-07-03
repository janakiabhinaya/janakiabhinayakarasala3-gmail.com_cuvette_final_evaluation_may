import React from 'react';
import styles from './logout.module.css';
import { useNavigate } from 'react-router-dom';

function Logout({ onClose }) {
    const navigate = useNavigate();
    const logout = ()=>{
        localStorage.clear();
        navigate('/homepage');
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <p>Are you sure you want to Logout?</p>
                <button onClick={logout} className={styles.logoutButton}>Yes,  Logout</button><br/>
                <button onClick={onClose} className={styles.closeButton}>Cancel</button>
            </div>
        </div>
    );
}

export { Logout };
