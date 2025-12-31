import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const { Pool } = pg;

// Initialize Database Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

app.use(cors());
app.use(express.json());

// The Task Route
app.get('/api/tasks', async (req, res) => {
    try {
        // Explicitly querying the 'flow' schema you created in DBeaver
        const result = await pool.query('SELECT * FROM flow.tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// --- NEW: Create a Task (POST) ---
app.post('/api/tasks', async (req, res) => {
    const { title, content, priority } = req.body;
    try {
        const project = await pool.query('SELECT id FROM flow.projects LIMIT 1');
        const result = await pool.query(
            'INSERT INTO flow.tasks (project_id, title, content, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [project.rows[0].id, title, content, priority || 'medium', 'todo']
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW: Delete a Task (DELETE) ---
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM flow.tasks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW: Update a Task Status (PATCH/PUT) ---
app.patch('/api/tasks/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE flow.tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Bridge Online: http://localhost:${PORT}`);
});