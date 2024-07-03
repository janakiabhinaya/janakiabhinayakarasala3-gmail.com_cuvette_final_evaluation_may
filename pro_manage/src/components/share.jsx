import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './share.module.css';
import { BACKEND_URL } from "../constant";
import codesandbox from '../images/codesandbox.png'
function SharedTask() {
    const { id } = useParams(); // Get the task ID from the URL params
    const [task, setTask] = useState(null); // State to hold the task data
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/task/taskdata/${id}`);
                setTask(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTask();
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    let priorityClass = '';
    switch (task.selectpriority) {
        case 'HIGH PRIORITY':
            priorityClass = styles.highPriority;
            break;
        case 'MODERATE PRIORITY':
            priorityClass = styles.mediumPriority;
            break;
        case 'LOW PRIORITY':
            priorityClass = styles.lowPriority;
            break;
        default:
            break;
    }
    const formatdate = (date) => {
        const options = { day: '2-digit', month: 'short' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };
    const completedCount = task.checklist.filter(item => item.completed).length;
    const totalCount = task.checklist.length;
    return (
        <div>
            {task ? (
                <div className={isMobile ? styles.sharetaskMobile : styles.sharetask}>
                    <div className={styles.Appname}><img src={codesandbox} className={styles.icon}/>Pro Manage</div>
                    <div className={styles.displaytask}><div className={styles.taskcontent}>
                    <div className={styles.stylingpriority}>
                            <span className={`${styles.priority} ${priorityClass}`}></span>
                            <div className={styles.priorityname}>{task.selectpriority}</div>
                        </div>
                    <h1>{task.title}</h1>
                    <h3>Checklist({completedCount}/{totalCount}) </h3>
                   <div className={styles.checklistContainer}> <ul>
                        {task.checklist.map((item, index) => (
                            <li key={index} className={styles.checklistdata}><input type="checkbox" checked={item.completed} className={styles.checkbox} readOnly/>
                        {item.text}</li>
                        ))}
                    </ul></div>
                    <p className={styles.duedate}><strong>Due Date</strong> <button>{formatdate(task.duedate)}</button></p>
                    </div></div>
                </div>
            ) : (
                <p>No task data available</p>
            )}
        </div>
    );
}

export { SharedTask };
