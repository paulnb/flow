import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const { Pool } = pg;

// --- FIX FOR ES MODULE PATHS ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5433'), // Default to 5433 as fallback
});

app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM flow.tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { title, content, priority } = req.body;
    try {
        // Ensure there is at least one project to link to
        const project = await pool.query('SELECT id FROM flow.projects LIMIT 1');

        // Handle case where no project exists (optional safety)
        const projectId = project.rows.length > 0 ? project.rows[0].id : null;

        const result = await pool.query(
            'INSERT INTO flow.tasks (project_id, title, content, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [projectId, title, content, priority || 'medium', 'todo']
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Task creation error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM flow.tasks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRODUCTION SERVING ---
// 1. Tell Express to serve the built React files from the 'dist' folder
app.use(express.static(path.join(__dirname, '../dist')));

// 2. The "Great UX" Catch-all (Express 5 RegExp Fix):
// We use a Regex /.*/ to match ANY path. This bypasses the strict string parser.
app.get(/.*/, (req, res) => {
    // Logic: If the request is NOT an API call, send the React app.
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    } else {
        // If it IS an API call but matched this wildcard, it means the API route doesn't exist (404)
        res.status(404).json({ error: 'API route not found' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bridge Online: Port ${PORT}`);
});