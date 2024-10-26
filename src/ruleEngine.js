const http = require('http');
const mongoose = require('mongoose');
const ruleController = require('./ruleController');

const MONGODB_URI = 'mongodb://localhost:27017';

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            if (req.url === '/api/rules/create-rule') {
                ruleController.createRule(body, res);
            } else if (req.url === '/api/rules/combine-rules') {
                ruleController.combineRules(body, res);
            } else if (req.url === '/api/rules/evaluate-rule') {
                ruleController.evaluateRule(body, res);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Not Found" }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
