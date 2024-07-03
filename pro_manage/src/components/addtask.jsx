import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './addtask.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Addtask({ onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [dueDate, setDueDate] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const datePickerRef = useRef(null);
    const datePickerContainerRef = useRef(null);

    useEffect(() => {
        if (datePickerRef.current && datePickerContainerRef.current) {
            const datePickerWidth = datePickerRef.current.offsetWidth;
            datePickerContainerRef.current.style.width = `${datePickerWidth}px`;
        }
    }, [isDatePickerOpen]);
    const handleSave = async () => {
        if (title.trim() !== '' && priority !== '' && checklist.length > 0) {
            try {
                const token = localStorage.getItem('token'); // Get the token from localStorage or wherever you store it
                if (!token) {
                    alert('Token not found');
                    return;
                }
                
                // Function to decode JWT token
                const decodeToken = (token) => {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        return JSON.parse(jsonPayload);
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        return null;
                    }
                };

                const decodedToken = decodeToken(token);
                if (!decodedToken || !decodedToken.userId) {
                    alert('Invalid token');
                    return;
                }

                const taskData = {
                    title,
                    selectpriority: priority,
                    checklist,
                    userId: decodedToken.userId // Include userId in the task data
                };

                if (dueDate) {
                    taskData.duedate = dueDate;
                }

                const response = await axios.post('http://localhost:3000/api/task/create', taskData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 201) {
                    // alert('Task created successfully');
                    onSave(response.data);
                    setTitle('');
                    setPriority('');
                    setChecklist([]);
                    setDueDate(null);
                    setIsDatePickerOpen(false);
                    onCancel();
                } else {
                    console.error('Unexpected response:', response);
                    alert('Failed to create task. Please try again.');
                }
            } catch (error) {
                console.error('Error creating task:', error.response ? error.response.data : error);
                alert(`Failed to create task. Please try again. Error: ${error.response ? error.response.data : error.message}`);
            }
        } else {
            alert('Please fill in all required fields.');
        }
    };

    const handleCancel = () => {
        onCancel();
        setTitle('');
        setPriority('');
        setChecklist([]);
        setDueDate(null);
        setIsDatePickerOpen(false);
    };

    const handleChecklistChange = (index, value) => {
        const newChecklist = [...checklist];
        newChecklist[index].text = value;
        setChecklist(newChecklist);
    };

    const addChecklistItem = () => {
        if (checklist.length === 0 || checklist[checklist.length - 1].text.trim() !== '') {
            setChecklist([...checklist, { text: '', completed: false }]);
        }
    };

    const removeChecklistItem = (index) => {
        const newChecklist = checklist.filter((_, i) => i !== index);
        setChecklist(newChecklist);
    };

    const toggleChecklistItem = (index) => {
        const newChecklist = [...checklist];
        newChecklist[index].completed = !newChecklist[index].completed;
        setChecklist(newChecklist);
    };

    const handleDateChange = (date) => {
        setDueDate(date);
        setIsDatePickerOpen(false);
    };

    const handleDatePickerCancel = () => {
        setIsDatePickerOpen(false);
    };

    const isLastChecklistItemFilled = checklist.length === 0 || checklist[checklist.length - 1].text.trim() !== '';

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div>
                    <label className={styles.title}>Title <span className={styles.required}>*</span></label><br/>
                    <input className={styles.inpufield} placeholder='Enter Task Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className={styles.prioritySelection}>
                    <div className={styles.namepriority}>Select Priority <span className={styles.required}>*</span></div>
                    <div className={styles.priorityButtons}>
                        <button
                            className={priority === 'HIGH PRIORITY' ? styles.selected : ''}
                            onClick={() => setPriority('HIGH PRIORITY')}><div className={styles.highPriorityCircle}></div>
                            HIGH PRIORITY
                        </button>
                        <button
                            className={priority === 'MODERATE PRIORITY' ? styles.selected : ''}
                            onClick={() => setPriority('MODERATE PRIORITY')}><div className={styles.mediumPriorityCircle}></div>
                            MODERATE PRIORITY
                        </button>
                        <button
                            className={priority === 'LOW PRIORITY' ? styles.selected : ''}
                            onClick={() => setPriority('LOW PRIORITY')}><div className={styles.lowPriorityCircle}></div>
                            LOW PRIORITY
                        </button>
                    </div>
                </div>
                <div>
                    <p className={styles.checklistname}>Checklist ({checklist.filter(item => item.completed).length}/{checklist.length}) <span className={styles.required}>*</span></p>
                  <div className={styles.checklistdata}> {checklist.map((item, index) => (
                        <div key={index} className={styles.checklistItem}>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleChecklistItem(index)}
                            />
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleChecklistChange(index, e.target.value)}
                                placeholder="Add a task"
                            />
                            <button onClick={() => removeChecklistItem(index)}><img src="/images/Delete.png" /></button>
                        </div>
                    ))}</div> 
                    <button className={styles.addnewbtn} onClick={addChecklistItem} disabled={!isLastChecklistItemFilled}>+ Add New</button>
                </div>
                <div className={styles.buttons}>
                    <button onClick={() => setIsDatePickerOpen(true)} className={styles.datebtn}>
                         {dueDate ? `${dueDate.toLocaleDateString('en-GB')}` : 'Select Due Date'}
                         </button>
                    {isDatePickerOpen && (
                        <div ref={datePickerContainerRef} className={styles.datePickerContainer}>
                            <DatePicker
                                selected={dueDate}
                                onChange={handleDateChange}
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                className={styles.datePicker}
                                inline
                                ref={datePickerRef}
                                placeholderText="Select Due Date"
                            />
                            <button onClick={handleDatePickerCancel}>Cancel</button>
                            
                        </div>
                    )}
                    {/* {dueDate && <p>Due Date: {dueDate.toLocaleDateString('en-GB')}</p>} */}
                    <button onClick={handleCancel} className={styles.cancelbtn}>Cancel</button>
                    <button onClick={handleSave} className={styles.savebtn}>Save</button>
                </div>
            </div>
        </div>
    );
}

export { Addtask };
