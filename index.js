require('isomorphic-fetch');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');

const helpers = require('./helpers');

const extractTableSearch = require('./lib/extract-table-search');
const extractTdList = require('./lib/extract-td-list-search');
const mapTdData = require('./lib/map-td-data');

const extractHash = require('./lib/extract-hash');
const existsKey = require('./lib/existsKey');

const parseTorrent = require('parse-torrent');
const fs = require('fs');
const path = require('path');
const PATH_TEMP = path.join(__dirname, "./temp");

app
  .use(bodyParser.json())
  .use((request,response, next) => {
    response.setHeader('X-Powered-By', 'PHP/5.1.2-1');
    next();
  })
  .use((request, response, next) => {

    if(request.url === "/") {
      return next();
    }

    const apiKey = request.headers['x-api-key'];

    if(!existsKey(apiKey)) {

      response.statusCode = 403;
      response.json({
        success: false,
        message: "Access denied"
      });

    } else {
      next();
    }

  })
;

app
  .get('/', (request, response) => {
    response.json({
      "success": true,
      "endpoints": {
        "search": {
          "uri": "/search/:q",
          "params": helpers.body.search
        },
        "hashFile": {
          "uri": "/hash/:id",
          "params": helpers.body.hashFile
        },
        "torrentFile": {
          "uri": "/torrent/:title/:hash",
          "params": helpers.body.torrentFile
        }
      },
      "auth": {
        "headers": "x-api-key"
      }
    });

  })
  .get('/search/:q', function(request, response) {

    const {q} = request.params;
    fetch(
      helpers.endpoints.search,
      {
        method: helpers.method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `q=${encodeURIComponent(q)}`
      }
    )
    .then(responseApi => {
      console.log("has get response");
      if(responseApi.status) {
        console.log("is success response");
        return responseApi.text();
      } else {
        response.statusCode = 500;
        response.json({
          success: false,
          message: "Internal server error"
        });
      }
    })
    .then(contentHtml => {

      console.log("has get content");

      const lines = extractTdList(extractTableSearch(contentHtml));

      const data = mapTdData(lines);

      console.log(data);

      response.json({
        success: true,
        items: data
      });
    });

  })
  .get('/hash/:id', function(request, response) {
    const {id} = request.params;

    fetch(
      helpers.endpoints.hashFile,
      {
        method: helpers.method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `id=${encodeURIComponent(id.trim())}`
      }
    )
    .then(responseApi => {
      console.log("has get response");
      if(responseApi.status) {
        console.log("is success response");
        return responseApi.text();
      } else {
        response.statusCode = 500;
        response.json({
          success: false,
          message: "Internal server error"
        });
      }
    })
    .then(contentHtml => {
      console.log("has get content");

      const hash = extractHash(contentHtml);

      response.json({
        success: true,
        hash
      });

    });
  })
  .get('/torrent/:title/:hash', function(request, response) {

    const {title, hash} = request.params;

    fetch(
      helpers.endpoints.torrentFile,
      {
        method: helpers.method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `titid=${encodeURIComponent(title)}&hashid=${hash}`
      }
    )
    .then(responseApi => {
      console.log("has get response");
      if(response.status) {
        response.type('application/x-bittorrent');

        responseApi.blob()
        .then(contentBlob => {
          blobStream = contentBlob.stream();
          blobStream.pipe(response);
        })
        .catch(() => {
          response.statusCode = 500;
          response.json({
            success: false,
            message: "Internal server error"
          });
        })
      } else {
        response.statusCode = 500;
        response.json({
          success: false,
          message: "Internal server error"
        });
      }
    })

  })
  .get('/metadata/:title/:hash', function(request, response) {

    const {title,hash} = request.params;

    const {pieces} = request.query;

    const addr = httpListener.address();
    const BASE_URL = addr.address === "::" && (addr.port === 5000 || addr.port === 3000) ? `http://localhost:${addr.port}`: "https://api-torrent.herokuapp.com";

    fetch(`${BASE_URL}/torrent/${encodeURIComponent(title)}/${hash}`)
    .then(torrentFile => {

      torrentFile.arrayBuffer()
      .then(arrayBuffer => {

        const buffer = Buffer.from(arrayBuffer);

        const filename = `${Date.now()}-${Math.random().toString().replace('.', '-')}.torrent`;

        fs.writeFileSync(path.join(PATH_TEMP, filename), buffer);

        const torrent = parseTorrent(fs.readFileSync(path.join(PATH_TEMP, filename)));

        if(!pieces) {
          delete torrent.pieces;
        }

        response.json({success: true, torrent});
        fs.unlinkSync(path.join(PATH_TEMP, filename));
      })
      .catch(error => {
        console.log("> read content torrent as arrayBuffer has fail");
        console.log(error);

        response.statusCode = 500;
        response.json({success: false, message: "Internal server error"});
      })
    })
    .catch(error => {
      console.log("> fetch content torrent has fail");
      console.log(error);

      response.statusCode = 500;
      response.json({success: false, message: "Internal server error"});
    })

  })
;

app
  .use((request, response) => {
    response.statusCode = 404;
    response.json({
      success: false,
      message: "Not found"
    });

  })
;

const httpListener = server.listen(process.env.PORT || 3000, () => {
  console.log("torrent API server run at:");
  console.log(httpListener.address());
});
