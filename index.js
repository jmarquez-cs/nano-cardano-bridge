const http = require('http');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const helmet = require('helmet');
const path = require('path');
const port = 80;

app.use(helmet());

// Configure Express to parse incoming JSON data
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

// static assets
app.use('/', express.static(path.join(__dirname, 'public')));

// webhook
app.post('/hook', (req, res) => {
  console.log(req.body) 
  res.status(200).end();
})

// serve app
const server = http.createServer(app);

if (server != null) {
  server.listen(port, () => {
    console.log(`Application running on port: ${port}`);
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
