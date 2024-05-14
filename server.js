const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

// Endpoint for full-text search with filters
app.get('/search', (req, res) => {
  const { level, log_string, timestamp, source } = req.query;
  const logFiles = ['log1.log', 'log2.log']; // List of log files to search
  let searchResults = [];

  // Function to read log files and search for matching logs
  function searchLogFile(file) {
    const filePath = path.join(__dirname, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const logs = JSON.parse(fileContents);

    searchResults = searchResults.concat(
      logs.filter(log => (
        (!level || log.level === level) &&
        (!log_string || log.log_string.includes(log_string)) &&
        (!timestamp || log.timestamp === timestamp) &&
        (!source || (log.metadata && log.metadata.source === source)) // Ensure metadata exists before accessing source
      ))
    );
  }

  // Search each log file
  logFiles.forEach(file => searchLogFile(file));

  res.json(searchResults);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});