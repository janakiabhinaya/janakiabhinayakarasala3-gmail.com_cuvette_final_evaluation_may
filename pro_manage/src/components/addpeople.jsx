import React, { useState } from 'react';
import { BACKEND_URL } from "../constant";
import axios from 'axios';
import styles from './addpeople.module.css';

function Addpeople({ onCancel }) {
    const [emails, setEmails] = useState(['']);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [addedEmails, setAddedEmails] = useState([]);

    const handleInputChange = (index, event) => {
        const newEmails = [...emails];
        newEmails[index] = event.target.value;
        setEmails(newEmails);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not authenticated');
                return;
            }

            const response = await axios.patch(`${BACKEND_URL}/api/auth/addpeople`, 
                { emails }, 
                { headers: { 'Authorization': `Bearer ${token}` } });

            if (response.status === 200) {
                setSuccessMessage('Emails added successfully');
                setAddedEmails(emails); // Store the added emails
                setEmails(['']); // Reset the emails input fields
            } else {
                setError('Failed to add emails');
            }
        } catch (error) {
            setError(`Failed to add emails: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <div className={styles.addpeople}>
            <div className={styles.popup}>
                {successMessage ? (
                    <div className={styles.successpop}>
                        <h2>
                            {addedEmails.map((email, index) => (
                                <div key={index} className={styles.successmail}>{email} added to board</div>
                            ))}
                        </h2>
                        <button className={styles.okbtn} onClick={onCancel}>Okay, got it!</button>
                    </div>
                ) : (
                    <div>
                        <h2>Add people to the board</h2>
                        <form onSubmit={handleSubmit}>
                            {emails.map((email, index) => (
                                <input
                                    key={index}
                                    type="email"
                                    value={email}
                                    onChange={(event) => handleInputChange(index, event)}
                                    placeholder="Enter email"
                                    required
                                />
                            ))}
                            <div>
                                <button className={styles.cancel} onClick={onCancel}>Cancel</button>
                                <button className={styles.addmail} type="submit">Add Email</button>
                            </div>
                        </form>
                    </div>
                )}
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
}

export { Addpeople };
