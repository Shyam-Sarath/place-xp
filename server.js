const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your frontend to talk to your backend
app.use(express.json());

// 1. Allow the frontend to download physical files from the 'uploads' folder
// (Moved to the top where middleware belongs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Connect to your SQLite Database
const db = new sqlite3.Database('./event_database.db');

// 3. Configure Multer (The File Handler)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Tells multer to save files in the 'uploads' folder
        cb(null, './uploads/'); 
    },
    filename: function (req, file, cb) {
        // PREVENTING OVERWRITES: Append a timestamp to the original name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeFilename = uniqueSuffix + '-' + file.originalname;
        cb(null, safeFilename);
    }
});

// Set up the upload middleware, restricting it to accept 1 file at a time
const upload = multer({ storage: storage });

// ---------------------------------------------------------
// ROUTE 1: Upload a file (POST)
// ---------------------------------------------------------
app.post('/api/upload', upload.single('presentationDocument'), (req, res) => {
    // req.file contains the physical file details that multer just saved
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const userId = req.body.userId; // Sent from frontend
    const originalName = req.file.originalname;
    const serverFilePath = req.file.path; // e.g., "uploads/16789...-report.pdf"

    // Save the record to the Database
    const sql = `INSERT INTO User_Documents (user_id, original_filename, server_filepath) 
                 VALUES (?, ?, ?)`;
                 
    db.run(sql, [userId, originalName, serverFilePath], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to link file to user in database." });
        }
        
        // Success!
        res.status(200).json({ 
            message: "File uploaded securely!", 
            document_id: this.lastID,
            filePath: serverFilePath
        });
    });
}); // <--- Notice that this route completely closes here now!

// ---------------------------------------------------------
// ROUTE 2: Get the list of files (GET)
// ---------------------------------------------------------
app.get('/api/documents', (req, res) => {
    // Queries the database for all files, newest first
    const sql = `SELECT * FROM User_Documents ORDER BY document_id DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to fetch documents." });
        }
        res.status(200).json({ documents: rows });
    });
});

// ---------------------------------------------------------
// Start the server
// ---------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});