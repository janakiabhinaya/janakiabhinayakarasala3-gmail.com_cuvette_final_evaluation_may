import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './edittask.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Edittask({ task, onEdit, onClose }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [assignee, setAssignee] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [dueDate, setDueDate] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checklistToDelete, setChecklistToDelete] = useState([]);
    const [addPeople, setAddPeople] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const datePickerRef = useRef(null);
    const datePickerContainerRef = useRef(null);
    useEffect(() => {
        if (datePickerRef.current && datePickerContainerRef.current) {
            const datePickerWidth = datePickerRef.current.offsetWidth;
            datePickerContainerRef.current.style.width = `${datePickerWidth}px`;
        }
    }, [isDatePickerOpen]);
    useEffect(() => {
        const loadTaskData = async () => {
            try {
                const response = await axios.get(`/api/task/taskdata/${task._id}`);
                const fetchedTask = response.data;
                setPriority(fetchedTask.priority || '');
                setAssignee(fetchedTask.assignee || '');
                setChecklist(fetchedTask.checklist || []);
                setDueDate(fetchedTask.dueDate ? new Date(fetchedTask.dueDate) : null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching task:', error);
                setError('Failed to load task data.');
                setLoading(false);
            }
        };
        const loadUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');
                if (!userId || !token) {
                    setError('User not authenticated');
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/auth/userdata/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = response.data;
                setAddPeople(user.addPeople || []);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data.');
            }
        };


        if (task._id) {
            loadTaskData();
        }
        loadUserData();
    }, [task._id]);

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
        const itemToDelete = checklist[index];
        if (itemToDelete._id) {
            setChecklistToDelete([...checklistToDelete, itemToDelete._id]);
        }
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

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/task/updateAll/${task._id}`, {
                title,
                selectpriority: priority,
                assignto: assignee,
                checklist,
                duedate: dueDate,
                checklistToDelete,
                userId
            },{
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onEdit();  // Notify parent component about the successful edit
            onClose();  // Close the modal
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task.');
        }
    };
    const getInitials = (email) => {
        const [firstName, domain] = email.split('@');
        return firstName.slice(0, 2).toUpperCase(); // Get the first two letters and convert to uppercase
    };
    const handleAssign = (email) => {
        setAssignee(email);
        setIsDropdownOpen(false);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
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
                <div className={styles.assigneeSelection}>
                            <label>Assign to</label>
                            <div className={styles.customDropdownContainer}>
                        <button className={styles.dropdownButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            {assignee ? assignee : 'Select Assignee'}
                        </button>
                        {isDropdownOpen && (
                            <div className={styles.customDropdownMenu}>
                                {addPeople.map((email, index) => (
                                    <div key={index} className={styles.customDropdownItem}>
                                        <div className={styles.emaillett}>{getInitials(email)}</div>
                                        <div className={styles.emailname}>{email}</div>
                                        <button className={styles.assignButton} onClick={() => handleAssign(email)} >Assign</button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                    <button onClick={onClose} className={styles.cancelbtn}>Cancel</button>
                    <button onClick={handleSave} className={styles.savebtn}>Save</button>
                </div>
            </div>
        </div>
            </div>
        </div>
    );
}

export { Edittask };
