import axios from 'axios';
import { BACKEND_URL } from "../constant";

const fetchTasks = async (selectedOption, setTasks, setError) => {
    try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        if (!token) {
            alert('Token not found');
            return;
        }
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('User ID not found');
            return;
        }
        if (!userEmail) {
            console.warn('User email not found in local storage.');
        }
        const response = await axios.get(`${BACKEND_URL}/api/task/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'email': userEmail
            },
            params: {
                filter: selectedOption
            }
        });

        if (response.status === 200) {
            const userTasks = response.data;
            const tasksByStatus = {
                backlog: userTasks.filter(task => task.status === 'backlog'),
                todo: userTasks.filter(task => task.status === 'todo'),
                inProgress: userTasks.filter(task => task.status === 'inProgress'),
                done: userTasks.filter(task => task.status === 'done')
            };

            setTasks(tasksByStatus);
            setError(''); // Clear any previous error message

            if (userTasks.length === 0) {
                alert(`No tasks found for ${selectedOption}`);
            }
        } else {
            console.error('Unexpected response:', response);
            alert('Failed to fetch tasks. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error.response ? error.response.data : error);
        setError(error.response ? error.response.data.message : 'Failed to fetch tasks. Please try again.');
    }
};

export { fetchTasks };