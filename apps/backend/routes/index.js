const express = require('express');

const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/* GET home page. */
router.get('/', async (req, res) => {
  fetch('http://localhost:3500/zond/v1/node/syncing')
    .then(async (resApi) => {
      const j = await resApi.json();
      j.data.connection = true;
      res.setHeader('Content-Type', 'application/json');
      res.send(j.data);
    })
    .catch(() => {
      console.log('No connection to zond node - is it running?');
      res.send({ connection: false });
    });
});

module.exports = router;
