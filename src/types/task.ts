export interface Task {
    id: string;
    title: string;
    content: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    createdAt?: string;
    updatedAt?: string;
}