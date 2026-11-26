// server
const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const BACKUP_DIR = 'C:/Users/abbie/OneDrive/FMS-backups';
fs.mkdirSync(BACKUP_DIR, { recursive: true});

const db = new Database('db/farm.db');
db.exec(fs.readFileSync('db/schema.sql', 'utf8'));

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/api/paddocks', (req,res) => {res.json(db.prepare('SELECT * FROM paddock').all())});
app.post('/api/paddocks', (req, res) => {db.prepare('INSERT INTO paddock (paddock_name) VALUES (?)').run(req.bodyname); res.json({ok: true});});

function backup(){
    const date = new Date().toISOString().slice(0,10);
    db.backup(path.join(BACKUP_DIR, `farm-${date}.db`)).then(() => console.log('Backup saved', date));

}
backup();
setInterval(backup, 24*60*60*1000);
app.listen(3000, '0.0.0.0', () => console.log("Running on port 3000"));