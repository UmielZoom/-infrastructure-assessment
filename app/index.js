const http = require('http');
const os = require('os');

const PORT = 8080;

const app = http.createServer((req, res) => {
  const hostname = os.hostname();
  const time = new Date().toISOString();
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Hello, Candidate!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #333; }
    .info { 
      background: #e8f4f8;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, Candidate!</h1>
    
    <div class="info">
      <p>This response was served by container <code>${hostname}</code>.</p>
      <p>Server time is: <code>${time}</code>.</p>
    </div>
    
    <p>If you reload this page, you should see the <strong>same</strong> time if caching is working correctly.</p>
    
    <p>Try refreshing multiple times - you may see different container hostnames (load balancing) but the same timestamp (caching).</p>
  </div>
</body>
</html>
  `;
  
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Cache-Control': 'public, max-age=60'  // Allow caching for 60 seconds
  });
  res.end(html);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
