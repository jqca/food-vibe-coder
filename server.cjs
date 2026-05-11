const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'dist', 'index.html')); });
const PORT = process.env.PORT || 4173;
app.listen(PORT, '0.0.0.0', () => { console.log(`[FoodVibeCoder] Server running on port ${PORT}`); });
