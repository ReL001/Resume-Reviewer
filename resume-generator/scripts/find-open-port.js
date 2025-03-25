/**
 * This script finds an available port for the server to use
 */
const net = require('net');
const fs = require('fs');
const path = require('path');

// Check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is in use
      } else {
        resolve(false); // Other error
      }
    });
    
    server.once('listening', () => {
      // Close the server if it's listening
      server.close();
      resolve(false); // Port is available
    });
    
    server.listen(port);
  });
}

// Find an available port starting from the base port
async function findAvailablePort(basePort, maxAttempts = 10) {
  let port = basePort;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      console.log(`Found available port: ${port}`);
      return port;
    }
    
    console.log(`Port ${port} is in use, trying next port...`);
    port++;
    attempts++;
  }
  
  throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
}

// Main function
async function main() {
  try {
    // Start from port 5000 as the base
    const port = await findAvailablePort(5000);
    
    // Save to .env.local or update the existing .env file
    const envPath = path.join(__dirname, '..', '.env.local');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
      
      // Replace or add the port
      if (envContent.includes('VITE_API_PORT=')) {
        envContent = envContent.replace(/VITE_API_PORT=\d+/, `VITE_API_PORT=${port}`);
      } else {
        envContent += `\nVITE_API_PORT=${port}`;
      }
    } else {
      envContent = `VITE_API_PORT=${port}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated ${envPath} with port ${port}`);
    
    // Also write to a port file for other scripts to read
    fs.writeFileSync(path.join(__dirname, '..', '.port'), port.toString());
    
    process.exit(0);
  } catch (error) {
    console.error('Error finding available port:', error);
    process.exit(1);
  }
}

main();
