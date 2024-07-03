import React from 'react';
import styles from './delete.module.css';
import axios from 'axios';

function Delete({ taskId, onClose, onDelete }) {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token not found');
                return;
            }

            const response = await axios.delete(`http://localhost:3000/api/task/delete/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                onDelete(); // Notify parent component of successful deletion
                onClose(); // Close the popup
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to delete task. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting task:', error.response ? error.response.data : error);
            alert(`Failed to delete task. Please try again. Error: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div>Are you sure you want to Delete?</div>
                <button className={styles.deleteButton} onClick={handleDelete}>Yes, Delete</button><br />
                <button className={styles.closeButton} onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export { Delete };
