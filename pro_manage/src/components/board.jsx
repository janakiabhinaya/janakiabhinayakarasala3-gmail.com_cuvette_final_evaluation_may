import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from "../constant";
import { FaPlus } from "react-icons/fa";
import { PiDotsThreeOutlineBold } from "react-icons/pi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Addtask } from './addtask';
import { GoPeople } from "react-icons/go";
import styles from './board.module.css';
import { Addpeople } from './addpeople';
import { fetchTasks } from './boardcontroller';
import { Delete } from './delete';
import { Edittask } from './edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import collapse from '../images/collapse.png';
function Board() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('thisweek');
    const [isAddingPeople, setIsAddingPeople] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [tasks, setTasks] = useState({
        backlog: [],
        todo: [],
        inProgress: [],
        done: []
    });
    const [error, setError] = useState('');
    const [checklistVisible, setChecklistVisible] = useState({});
    const [userName, setUserName] = useState('');
    const [menuVisible, setMenuVisible] = useState({});
    const [isDeletingTask, setIsDeletingTask] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [publicLink, setPublicLink] = useState(''); // State to store the public link
    const [navigateToPublic, setNavigateToPublic] = useState(false); 
    useEffect(() => {
        if (navigateToPublic && publicLink) {
            navigate(publicLink);
            setNavigateToPublic(false);
        }
    }, [navigateToPublic, publicLink, navigate]);

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId')
                if (!token) {
                    alert('Token not found');
                    return;
                }

                const response = await axios.get(`${BACKEND_URL}/api/auth/userdata/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setUserName(response.data.name); // Adjust this based on your API response
                } else {
                    console.error('Failed to fetch user data:', response);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error);
            }
        };

        fetchUserData();
    }, []);
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'short' });
        const year = date.getFullYear();
        const daySuffix = getDaySuffix(day);
        return `${day}${daySuffix} ${month}, ${year}`;
    };
    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };
    useEffect(() => {
        const today = new Date();
        setCurrentDate(formatDate(today));
        fetchTasks(selectedOption, setTasks, setError);
    }, [selectedOption]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setMenuVisible({});
    };

    const handlePlusClick = () => {
        setIsAddingTask(true);
    };

    const handleCancelAddTask = () => {
        setIsAddingTask(false);
    };

    const handleAddPeopleClick = () => {
        setIsAddingPeople(true);
    };

    const handleCancelAddPeople = () => {
        setIsAddingPeople(false);
    };

    const toggleCheckbox = async (taskId, itemIndex, checked, status) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token not found');
                return;
            }

            const updatedTasks = { ...tasks };
            const task = updatedTasks.backlog
                .concat(updatedTasks.todo, updatedTasks.inProgress, updatedTasks.done)
                .find(task => task._id === taskId);

            if (!task) {
                console.error('Task not found');
                return;
            }

            if (itemIndex !== undefined) {
                task.checklist[itemIndex].completed = checked;
            } else {
                task.status = status;
            }

            const response = await axios.patch(`${BACKEND_URL}/api/task/update/${taskId}`, task, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                fetchTasks(selectedOption, setTasks, setError);
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to update task. Please try again.');
            }
        } catch (error) {
            console.error('Error updating task:', error.response ? error.response.data : error);
            alert(`Failed to update task. Please try again. Error: ${error.response ? error.response.data : error.message}`);
        }
    };

    const truncateTitle = (title, limit) => {
        if (title.length > limit) {
            return `${title.substring(0, limit)}...`;
        }
        return title;
    };

    const toggleChecklistVisibility = (taskId) => {
        setChecklistVisible(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }));
    };

    const toggleMenuVisibility = (taskId) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }));
    };

    const handleDeleteClick = (taskId) => {
        setTaskToDelete(taskId);
        setIsDeletingTask(true);
        setMenuVisible(prevState => ({
            ...prevState,
            [taskId]: false
        }));
    };

    const handleDeleteTask = () => {
        setIsDeletingTask(false);
        fetchTasks(selectedOption, setTasks, setError);
    };

    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setIsEditingTask(true);
        setMenuVisible(prevState => ({
            ...prevState,
            [task._id]: false
        }));
    };

    const handleEditTask = () => {
        setIsEditingTask(false);
        fetchTasks(selectedOption, setTasks, setError);
    };
    const formatdate = (date) => {
        const options = { day: '2-digit', month: 'short' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };
    
    const handleShareClick = (taskId) => {
        const link = `/shared-task/${taskId}`;
        setPublicLink(link);
        navigator.clipboard.writeText(link)
        .then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 5000); // Hide the alert after 2 seconds
        })
        .catch(err => {
            console.error('Failed to copy link:', err);
            alert('Failed to copy link. Please try again.');
        });
    };
    const handleLinkClick = () => {
        setNavigateToPublic(true);
    };

    const collapseAllChecklists = (from) => {
        const updatedVisibility = {};
        tasks[from].forEach(task => {
            updatedVisibility[task._id] = false;
        });
        setChecklistVisible(prevState => ({
            ...prevState,
            ...updatedVisibility
        }));
    };

    const renderTasks = (taskList, from) => (
        taskList.map((task, index) => {
            const completedCount = task.checklist.filter(item => item.completed).length;
            const totalCount = task.checklist.length;
            const truncatedTitle = truncateTitle(task.title, 30);
            let priorityClass = '';
            let dueDateClass = '';
            const dueDate = new Date(task.duedate);
        const today = new Date();
        if (task.status === 'done') {
            dueDateClass = styles.completedDueDate;
        } else if (dueDate < today) {
            dueDateClass = styles.pastDueDate;
        } else {
            dueDateClass = styles.currentDueDate;
        }
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

            return (
                <div key={index} className={styles.taskDetails}>
                    <div className={styles.taskdiv1}>
                        <div className={styles.stylingpriority}>
                            <span className={`${styles.priority} ${priorityClass}`}></span>
                            <div className={styles.priorityname}>{task.selectpriority}</div>
                            {task.assignto ? (
                                 <div className={styles.assignicon}>
                                      {task.assignto.slice(0, 2).toUpperCase()}
                                 </div>
                             ) : null}
                        </div>
                        <div className={styles.dots}>
                            <PiDotsThreeOutlineBold onClick={() => toggleMenuVisibility(task._id)} />
                            {menuVisible[task._id] && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownItem} task={taskToEdit} onClick={() => handleEditClick(task)}>Edit</div>
                                    <div className={styles.dropdownItem} onClick={() => handleShareClick(task._id)}>Share</div>
                                    <div className={styles.dropdownItem} onClick={() => handleDeleteClick(task._id)}>Delete</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.title} data-title={task.title}>{truncatedTitle}</div>
                    <div className={styles.checklist}>
                        <div className={styles.checklistHeader} onClick={() => toggleChecklistVisibility(task._id)}>
                            Checklist ({completedCount}/{totalCount}) {checklistVisible[task._id] ? <IoIosArrowUp className={styles.iconstyle} /> : <IoIosArrowDown className={styles.iconstyle} />}
                        </div>
                        <div className={styles.listing}>
                            {checklistVisible[task._id] && (
                                <ul>
                                    {task.checklist && task.checklist.length > 0 ? (
                                        task.checklist.map((item, idx) => (
                                            <li key={idx}>
                                                <input type="checkbox" checked={item.completed} className={styles.checkbox}
                                                    onChange={(e) => toggleCheckbox(task._id, idx, e.target.checked)} />
                                                {item.text}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No items</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className={styles.allbtn}>
                        <div>
                    {task.duedate && (
                            <button className={`${styles.dueDate} ${dueDateClass}`}>
                                {formatdate(task.duedate)}
                            </button>
                        )}</div>
                        <div className={styles.taskButtons}>
                            {from !== 'backlog' && <button onClick={() => toggleCheckbox(task._id, undefined, undefined, 'backlog')}>BACKLOG</button>}
                            {from !== 'todo' && <button onClick={() => toggleCheckbox(task._id, undefined, undefined, 'todo')}>TO-DO</button>}
                            {from !== 'inProgress' && <button onClick={() => toggleCheckbox(task._id, undefined, undefined, 'inProgress')}>PROGRESS</button>}
                            {from !== 'done' && <button onClick={() => toggleCheckbox(task._id, undefined, undefined, 'done')}>DONE</button>}
                        </div>
                    </div>
                </div>
            );
        })
    );

    return (
        <div className={styles.dashboard}>
            <div className={styles.introdiv}>
                <div className={styles.namediv}>Welcome! {userName}</div>
                {linkCopied && (
                <div className={styles.linkCopiedAlert} onClick={handleLinkClick}>
                    Link Copied!
                </div>
            )}
                <div className={styles.datediv}>{currentDate}</div>
            </div>
            <div className={styles.headdiv}>
                <div className={styles.board}>
                    Board <span onClick={handleAddPeopleClick}><GoPeople />Add People</span>
                </div>
                <div className={styles.selectoption}>
                    <select className={styles.filter} value={selectedOption} onChange={handleSelectChange}>
                        <option value="today" className={styles.option}>Today</option>
                        <option value="thisweek" className={styles.option}>This Week</option>
                        <option value="thismonth" className={styles.option}>This Month</option>
                    </select>
                </div>
            </div>
            <div className={styles.task}>
                <div className={styles.item}>
                    <div className={styles.taskhead}>Backlog <img src={collapse} onClick={() => collapseAllChecklists('backlog')}/></div>
                    <div className={styles.taskholder}>
                        <div className={styles.taskplaced}>{renderTasks(tasks.backlog, 'backlog')}</div>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.taskhead}>
                        To do
                        <div className={styles.todohead}>
                            <FaPlus style={{ width: '25px', height: '25px' }} onClick={handlePlusClick} />
                            <img src={collapse} onClick={() => collapseAllChecklists('todo')}/>
                        </div>
                    </div>
                    {isAddingTask && <Addtask onCancel={handleCancelAddTask} onSave={(taskData) => {
                        fetchTasks(selectedOption, setTasks, setError);
                        setIsAddingTask(false);
                    }} />}
                    <div className={styles.taskholder}>
                        <div className={styles.taskplaced}>{renderTasks(tasks.todo, 'todo')}</div>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.taskhead}>In progress <img src={collapse} onClick={() => collapseAllChecklists('inProgress')}/></div>
                    <div className={styles.taskholder}>
                        <div className={styles.taskplaced}>{renderTasks(tasks.inProgress, 'inProgress')}</div>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.taskhead}>Done <img src={collapse} onClick={() => collapseAllChecklists('done')}/></div>
                    <div className={styles.taskholder}>
                        <div className={styles.taskplaced}>{renderTasks(tasks.done, 'done')}</div>
                    </div>
                </div>
            </div>
            {isAddingPeople && <Addpeople onCancel={handleCancelAddPeople} />}
            {isDeletingTask && <Delete taskId={taskToDelete} onDelete={handleDeleteTask} onClose={() => setIsDeletingTask(false)} />}
            {isEditingTask && <Edittask task={taskToEdit} onEdit={handleEditTask} onClose={() => setIsEditingTask(false)} />}
        </div>
    );
}

export {Board};
