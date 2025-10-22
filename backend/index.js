const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;
const WebSocket = require('ws');
const YAML = require('yaml');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Home Assistant configuration
const HA_URL = process.env.SUPERVISOR_URL || 'http://supervisor/core';
const HA_TOKEN = process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get Home Assistant entities
app.get('/api/entities', async (req, res) => {
  try {
    // In real implementation, this would connect to HA API
    // For now, return mock data
    const entities = [
      { entity_id: 'light.living_room', friendly_name: 'Living Room Light', state: 'on' },
      { entity_id: 'switch.kitchen', friendly_name: 'Kitchen Switch', state: 'off' },
      { entity_id: 'sensor.temperature', friendly_name: 'Temperature Sensor', state: '22.5' },
      { entity_id: 'binary_sensor.motion', friendly_name: 'Motion Sensor', state: 'off' }
    ];
    res.json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// Save floorplan configuration
app.post('/api/floorplan/save', async (req, res) => {
  try {
    const { name, config } = req.body;
    
    if (!name || !config) {
      return res.status(400).json({ error: 'Name and config are required' });
    }

    // Save to file system (in real addon, this would be in HA config)
    const configPath = path.join(__dirname, '../data', `${name}.yaml`);
    const yamlContent = YAML.stringify(config);
    
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, yamlContent, 'utf8');
    
    res.json({ success: true, message: 'Floorplan saved successfully' });
  } catch (error) {
    console.error('Error saving floorplan:', error);
    res.status(500).json({ error: 'Failed to save floorplan' });
  }
});

// Load floorplan configuration
app.get('/api/floorplan/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const configPath = path.join(__dirname, '../data', `${name}.yaml`);
    
    const yamlContent = await fs.readFile(configPath, 'utf8');
    const config = YAML.parse(yamlContent);
    
    res.json(config);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Floorplan not found' });
    } else {
      console.error('Error loading floorplan:', error);
      res.status(500).json({ error: 'Failed to load floorplan' });
    }
  }
});

// List saved floorplans
app.get('/api/floorplans', async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    
    try {
      const files = await fs.readdir(dataDir);
      const floorplans = files
        .filter(file => file.endsWith('.yaml'))
        .map(file => file.replace('.yaml', ''));
      
      res.json(floorplans);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.json([]);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error listing floorplans:', error);
    res.status(500).json({ error: 'Failed to list floorplans' });
  }
});

// Export floorplan for ha-floorplan
app.get('/api/floorplan/:name/export', async (req, res) => {
  try {
    const { name } = req.params;
    const { format = 'ha-floorplan' } = req.query
    const configPath = path.join(__dirname, '../data', `${name}.yaml`);
    
    const yamlContent = await fs.readFile(configPath, 'utf8');
    const config = YAML.parse(yamlContent);
    
    let exportConfig
    let filename

    // Transform based on requested format
    if (format === 'lovelace') {
      exportConfig = transformToLovelace(config)
      filename = `${name}-lovelace.yaml`
    } else {
      exportConfig = transformToHaFloorplan(config)
      filename = `${name}-floorplan.yaml`
    }
    
    res.setHeader('Content-Type', 'application/x-yaml');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(YAML.stringify(exportConfig));
  } catch (error) {
    console.error('Error exporting floorplan:', error);
    res.status(500).json({ error: 'Failed to export floorplan' });
  }
});

// Add card directly to Lovelace dashboard
app.post('/api/floorplan/:name/add-to-dashboard', async (req, res) => {
  try {
    const { name } = req.params;
    const { dashboardPath = 'lovelace', viewIndex = 0, format = 'lovelace' } = req.body;
    
    if (!HA_TOKEN) {
      return res.status(500).json({ 
        error: 'Home Assistant token not available',
        details: 'SUPERVISOR_TOKEN or HA_TOKEN environment variable not set'
      });
    }

    // Load floor plan config
    const configPath = path.join(__dirname, '../data', `${name}.yaml`);
    const yamlContent = await fs.readFile(configPath, 'utf8');
    const config = YAML.parse(yamlContent);

    // Transform to card config
    const cardConfig = format === 'lovelace' 
      ? transformToLovelace(config)
      : transformToHaFloorplan(config);

    // Get current Lovelace config
    const lovelaceUrl = `${HA_URL}/api/lovelace/${dashboardPath}`;
    const headers = {
      'Authorization': `Bearer ${HA_TOKEN}`,
      'Content-Type': 'application/json'
    };

    let lovelaceConfig;
    try {
      const response = await axios.get(lovelaceUrl, { headers });
      lovelaceConfig = response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Dashboard doesn't exist, create minimal config
        lovelaceConfig = {
          views: [{
            title: 'Home',
            path: 'home',
            cards: []
          }]
        };
      } else {
        throw error;
      }
    }

    // Ensure views array exists
    if (!lovelaceConfig.views || !Array.isArray(lovelaceConfig.views)) {
      lovelaceConfig.views = [{
        title: 'Home',
        path: 'home',
        cards: []
      }];
    }

    // Ensure target view exists
    if (!lovelaceConfig.views[viewIndex]) {
      lovelaceConfig.views[viewIndex] = {
        title: `View ${viewIndex}`,
        path: `view-${viewIndex}`,
        cards: []
      };
    }

    // Ensure cards array exists
    if (!lovelaceConfig.views[viewIndex].cards) {
      lovelaceConfig.views[viewIndex].cards = [];
    }

    // Add card to the view
    lovelaceConfig.views[viewIndex].cards.push(cardConfig);

    // Update Lovelace config
    await axios.post(lovelaceUrl, lovelaceConfig, { headers });

    res.json({ 
      success: true, 
      message: 'Floor plan card added to dashboard',
      dashboard: dashboardPath,
      view: viewIndex,
      cardIndex: lovelaceConfig.views[viewIndex].cards.length - 1
    });

  } catch (error) {
    console.error('Error adding card to dashboard:', error);
    res.status(500).json({ 
      error: 'Failed to add card to dashboard',
      details: error.message,
      haError: error.response?.data
    });
  }
});

// Get available Lovelace dashboards
app.get('/api/lovelace/dashboards', async (req, res) => {
  try {
    if (!HA_TOKEN) {
      return res.json([{ path: 'lovelace', title: 'Default Dashboard' }]);
    }

    const headers = {
      'Authorization': `Bearer ${HA_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // Try to get dashboards list
    try {
      const response = await axios.get(`${HA_URL}/api/lovelace/resources`, { headers });
      // Get all available dashboards
      const dashboards = [
        { path: 'lovelace', title: 'Default Dashboard' }
      ];
      
      res.json(dashboards);
    } catch (error) {
      // Fallback to default
      res.json([{ path: 'lovelace', title: 'Default Dashboard' }]);
    }
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.json([{ path: 'lovelace', title: 'Default Dashboard' }]);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`HA Floor Plan Editor server running on port ${PORT}`);
});

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Transform internal config to ha-floorplan format
function transformToHaFloorplan(config) {
  return {
    type: 'custom:floorplan-card',
    config: {
      image: config.image || '/local/floorplan.svg',
      stylesheet: config.stylesheet || '/local/floorplan.css',
      rules: config.elements?.map(element => ({
        entity: element.entity_id,
        element: element.id,
        states: element.states || [
          { state: 'on', class: 'light-on' },
          { state: 'off', class: 'light-off' }
        ]
      })) || []
    }
  };
}

// Transform internal config to Lovelace picture-elements format
function transformToLovelace(config) {
  const canvasWidth = 800
  const canvasHeight = 600

  const elements = []

  // Add device elements
  if (config.elements) {
    config.elements.forEach(element => {
      const style = {
        left: `${(element.left / canvasWidth * 100).toFixed(2)}%`,
        top: `${(element.top / canvasHeight * 100).toFixed(2)}%`,
        transform: element.angle ? `rotate(${element.angle}deg)` : undefined
      }

      if (element.entityId) {
        // Device with HA entity
        elements.push({
          type: 'state-icon',
          entity: element.entityId,
          style,
          tap_action: {
            action: element.clickAction || 'more-info'
          }
        })
      } else {
        // Static icon/shape
        elements.push({
          type: 'icon',
          icon: getIconForType(element.type),
          style: {
            ...style,
            color: element.color || '#000000'
          }
        })
      }
    })
  }

  // Add zone elements
  if (config.roomElements) {
    config.roomElements
      .filter(el => el.type === 'zone')
      .forEach(zone => {
        const style = {
          left: `${(zone.left / canvasWidth * 100).toFixed(2)}%`,
          top: `${(zone.top / canvasHeight * 100).toFixed(2)}%`,
          width: `${((zone.width * (zone.scaleX || 1)) / canvasWidth * 100).toFixed(2)}%`,
          height: `${((zone.height * (zone.scaleY || 1)) / canvasHeight * 100).toFixed(2)}%`,
          ...(zone.cssProperties || {})
        }

        elements.push({
          type: 'custom:button-card',
          name: zone.name || 'Zone',
          show_name: false,
          show_icon: false,
          styles: {
            card: [style]
          }
        })
      })
  }

  return {
    type: 'picture-elements',
    image: config.backgroundImage || '/local/floorplan.png',
    elements
  }
}

// Helper to map element types to HA icons
function getIconForType(type) {
  const iconMap = {
    light: 'mdi:lightbulb',
    switch: 'mdi:power',
    sensor: 'mdi:thermometer',
    camera: 'mdi:cctv',
    speaker: 'mdi:speaker'
  }
  return iconMap[type] || 'mdi:help-circle'
}

module.exports = app;