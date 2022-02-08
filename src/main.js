const fs = require('fs');
const path = require('path');
const fetch = require('cross-fetch');

const productId = process.argv[2] || false;

if (!productId) {
  throw new Error('Please input product sticker id')
}

const option = {
  headers: {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
  }
}

const basePath = path.join(__dirname, '../', 'sticker', productId);

fs.mkdir(basePath, { recursive: true }, (err) => err);

fetch(`https://store.line.me/stickershop/product/${productId}/zh-Hant`, option)
  .then((res) => res.text())
  .then((html) => {
    const regex = /https:\/\/stickershop\.line-scdn.net\/stickershop\/v1\/sticker\/[0-9]+\/android\/sticker\.png/mg;
    const matchUrl = [...new Set(html.match(regex))];
    matchUrl.forEach((stickerUrl) => {
      fetch(stickerUrl)
        .then((res) => res.buffer())
        .then((buffer) => {
          const stickerName = `${stickerUrl.match(/\/([0-9]+)\/android\/sticker\.png/)[1]}.png`;
          const stickerPath = path.join(basePath, stickerName);
          fs.writeFileSync(stickerPath, buffer);
        });
    });
  });