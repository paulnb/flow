import axios from 'axios';
// Use 'any' for the task type here to keep it simple and error-free for now
import type { Task } from '../types/task';

// SMART URL SELECTION
// If building for production (Vite detects this), use a relative path '/api'.
// This lets the browser talk to 'flow.coepi.co/api' automatically.
// If in dev, keep using localhost:3001.
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
};

// NEW: This allows App.tsx to send data to the server
export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
};

// NEW: This allows App.tsx to delete data
export const deleteTask = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/tasks/${id}`);
};