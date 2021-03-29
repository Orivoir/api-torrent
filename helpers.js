module.exports = {
  endpoints: {
    search: "https://torrentz2fr.xyz/search/",
    hashFile: "https://torrentz2fr.xyz/torrent-page/",
    torrentFile: "https://torrentz2fr.xyz/torfile/"
  },

  body: {
    search: [
      {name: "q", describe: "value of search content", isRequired: true}
    ],
    hashFile: [
      {name: "id", describe: "movie id target for get hash torrent file", isRequired: true}
    ],
    torrentFile: [
      {name: "titid", describe: "title id of movie target (get from search endpoint)", isRequired: true},
      {name: "hashid", describe: "hash of torrent file (get from hashFile endpoint)", isRequired: true},
    ]
  },

  response: {
    search: "text/html; charset=UTF-8",
    hashFile: "text/html; charset=UTF-8",
    torrentFile: "application/x-bittorrent"
  },

  // for all endpoints
  headers: [
    {name: "Content-Type", value: "application/x-www-form-urlencoded"},
  ],
  method: "POST"
};
