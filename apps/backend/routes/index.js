const express = require('express');
const du = require('du');

const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

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
      res.setHeader('Content-Type', 'application/json');
      res.send({ connection: false });
    });
});

router.get('/size', async (req, res) => {
  try {
    let sizeB = await du('../../../beacondata/');
    let sizeG = await du('../../../gzonddata/');
    console.log(`The size of beacondata is: ${formatBytes(sizeB)}`);
    console.log(`The size of gzonddata is: ${formatBytes(sizeG)}`);
    res.setHeader('Content-Type', 'application/json');
    res.send({
      success: true,
      beacon: formatBytes(sizeB),
      gzond: formatBytes(sizeG)
    });
  } catch (e) {
    console.log('Unable to get size of data files - are paths correct?');
    res.setHeader('Content-Type', 'application/json');
    res.send({ success: false });
  }
  
});

module.exports = router;
