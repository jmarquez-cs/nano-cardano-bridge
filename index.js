const http = require('http');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const helmet = require('helmet');
const port = process.env.PORT || 8081;
const { getDb } = require('./firebase/firebase');
const db = getDb();
const { BridgePairs } = require('./firebase/collections');

let _bridgePairs = [];

app.use(helmet());

app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());

app.use((error, req, res, next) => {
  return res.status(500).json({ error: error.toString() });
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('online').status(200).end();
});

// serve app
const server = http.createServer(app);

if (server != null) {
  server.listen(port, async () => {
    console.log(`Application running on port: ${port}\n`);

    try {
      const bridgePairCollection = await db.collection(`${BridgePairs}`).get();
      bridgePairCollection.docs.forEach(async receiptDoc => {

        const waReceive = receiptDoc.data().waReceive;
        const userReceive = receiptDoc.data().userReceive;
        const waAsset = receiptDoc.data().waAsset;
        const userAsset = receiptDoc.data().userAsset;

        _bridgePairs.push({ 
          waReceive: waReceive,
          userReceive: userReceive,
          waAsset: waAsset,
          userAsset: userAsset
        })
        return;
      })
    } catch (error) {
      throw error;
    }
    
    console.log("\n-------------- Bridge Pairs -------------\n");
    console.log(_bridgePairs);
  });
}

// Show IP address in console
const ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  })
})
