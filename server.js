const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const port = process.env.PORT || 3000;

// Charger la spécification OpenAPI
const apiSpec = yaml.load(fs.readFileSync('./spec.yaml', 'utf8'));

// Middleware JSON
app.use(express.json());

// Servir la documentation Swagger directement sur /api
app.use('/api', swaggerUi.serveFiles(apiSpec), (req, res, next) => {
  if (req.path === '/' || req.path === '') {
    swaggerUi.setup(apiSpec)(req, res);
  } else {
    next();
  }
});

// Importer les routes de l'API
const api = require('./backend/api/routes/api');

// Utiliser les routes de l'API
app.use('/api', api);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  console.log(`Documentation Swagger disponible sur http://localhost:${port}/api`);
});
