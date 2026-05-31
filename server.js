require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.options('*', cors());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

let users = [];
let devices = [];
let locations = [];
let tokens = [];

app.post('/api/auth/signup', (req, res) => {
    const { email, password } = req.body;
    const user = { email, password };
    users.push(user);
    const token = Math.random().toString(36).substr(2, 10);
    tokens.push({ email, token });
    res.json({ token });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = Math.random().toString(36).substr(2, 10);
    tokens.push({ email, token });
    res.json({ token });
});

app.get('/api/devices', (req, res) => {
    res.json({ devices });
});

app.post('/api/locations', (req, res) => {
    const { deviceId, latitude, longitude } = req.body;
    const device = devices.find(d => d.id === deviceId);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    locations.push({ deviceId, latitude, longitude });
    res.json({ success: true });
});

app.get('/api/tracking-history', (req, res) => {
    res.json({ history: locations });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));