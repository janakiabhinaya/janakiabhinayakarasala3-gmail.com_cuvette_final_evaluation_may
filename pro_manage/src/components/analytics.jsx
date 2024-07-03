import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from "../constant";
import styles from './analytics.module.css';
import axios from 'axios';
function Analytics(){
    const [analytics, setAnalytics] = useState({
        backlog: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        lowPriority: 0,
        moderatePriority: 0,
        highPriority: 0,
        dueDateTasks: 0,
    });
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Token not found');
                    return;
                }
                const userId = localStorage.getItem('userId');
                if (!userId) {
                  alert('User ID not found');
                  return;
                }
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    alert('User Email not found');
                    return;
                }
                const response = await axios.get(`${BACKEND_URL}/api/task/analytics/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'email': userEmail
                    },
                });

                if (response.status === 200) {
                    setAnalytics(response.data);
                } else {
                    console.error('Unexpected response:', response);
                    alert('Failed to fetch analytics. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching analytics:', error.response ? error.response.data : error);
                alert(`Failed to fetch analytics. Please try again. Error: ${error.response ? error.response.data : error.message}`);
            }
        };

        fetchAnalytics();
    }, []);
    return(
        <div className={styles.analysis}>
        <div className={styles.headpart}>Analytics</div>
        <div className={styles.analyticpart}>
            <div className={styles.childcard}>
                <ul className={styles.content}>
                    <li className={styles.listitem}><span>Backlog Tasks</span><span>{analytics.backlog}</span></li>
                    <li className={styles.listitem}><span>To-do Tasks</span><span>{analytics.todo}</span></li>
                    <li className={styles.listitem}><span>In-Progress Tasks</span><span>{analytics.inProgress}</span></li>
                    <li className={styles.listitem}><span>Completed Tasks</span><span>{analytics.done}</span></li>
                </ul>
            </div>
            <div className={styles.childcard}>
               <ul className={styles.content}>
                    <li className={styles.listitem}><p>Low Priority</p><p>{analytics.lowPriority}</p></li>
                    <li className={styles.listitem}><p>Moderate Priority</p><p>{analytics.moderatePriority}</p></li>
                    <li className={styles.listitem}><p>High Priority</p><p>{analytics.highPriority}</p></li>
                    <li className={styles.listitem}><p>Due Date Tasks</p><p>{analytics.dueDateTasks}</p></li>
                </ul>
            </div>
        </div>
        </div>
    )
}
export{Analytics};