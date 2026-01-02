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
    port: parseInt(process.env.DB_PORT || '5433'),
});

app.use(cors());
app.use(express.json());

// --- API ROUTES ---

// 1. GET TASKS (Fixed: Removed 'flow.', added camelCase aliases)
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, content, priority, status, created_at as "createdAt", updated_at as "updatedAt" 
             FROM tasks ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// 2. CREATE TASK (Fixed: Removed 'flow.', removed 'project_id' logic)
app.post('/api/tasks', async (req, res) => {
    const { title, content, priority, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, content, priority, status) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, title, content, priority, status, created_at as "createdAt"`,
            [title, content, priority || 'medium', status || 'todo']
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Task creation error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE TASK (Fixed: Ensure it matches the table structure)
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, priority, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 content = COALESCE($2, content),
                 priority = COALESCE($3, priority),
                 status = COALESCE($4, status),
                 updated_at = NOW()
             WHERE id = $5
                 RETURNING id, title, content, priority, status, created_at as "createdAt", updated_at as "updatedAt"`,
            [title, content, priority, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE TASK (Fixed: Removed 'flow.')
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRODUCTION SERVING ---
// 1. Tell Express to serve the built React files from the 'dist' folder
app.use(express.static(path.join(__dirname, '../dist')));

// 2. The "Great UX" Catch-all
app.get(/.*/, (req, res) => {
    // Logic: If the request is NOT an API call, send the React app.
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    } else {
        res.status(404).json({ error: 'API route not found' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bridge Online: Port ${PORT}`);
});