const {
    ApolloServer,
    gql
} = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

const playlist = [{
        id: 11,
        title: 'I\'m cool',
        genre: 'Rock',
        tracks: []
    },
    {
        id: 12,
        title: 'I wanna cry',
        genre: 'Hard Rock',
        tracks: []
    }, {
        id: 13,
        title: 'Help, I need smbd\'s help',
        genre: 'Jazz',
        tracks: []
    }, {
        id: 14,
        title: 'I need some sleep',
        genre: 'Jazz',
        tracks: []
    },
];

const track = [{
        id: 21,
        name: 'I\'m cool',
        band: 'TS',
        stars: 4,
        playlist: playlist[0]
    },
    {
        id: 22,
        name: 'Mamma',
        band: 'Cry baby cry',
        stars: 4,
        playlist: playlist[0]
    }, {
        id: 23,
        name: 'O-o-o',
        band: 'vas',
        stars: 3,
        playlist: playlist[1]
    }, {
        id: 24,
        name: 'cos1715',
        band: 'cosmos',
        stars: 5,
        playlist: playlist[1]
    }, {
        id: 25,
        name: 'LE',
        band: 'LeEco',
        stars: 5,
        playlist: playlist[2]
    }, {
        id: 26,
        name: 'Ugears',
        band: 'Mibamd',
        stars: 5,
        playlist: playlist[2]
    }, {
        id: 27,
        name: 'Botler',
        band: 'hol',
        stars: 5,
        playlist: playlist[3]
    }, {
        id: 28,
        name: 'zso',
        band: 'zippo',
        stars: 3,
        playlist: playlist[3]
    },
];



playlist[0].tracks.push(track[0]);
playlist[0].tracks.push(track[1]);
playlist[1].tracks.push(track[2]);
playlist[1].tracks.push(track[3]);
playlist[2].tracks.push(track[4]);
playlist[2].tracks.push(track[5]);
playlist[3].tracks.push(track[6]);
playlist[3].tracks.push(track[7]);

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql `
  # Comments in GraphQL are defined with the hash (#) symbol.
  type Playlist {
    id: ID
    title: String
    genre: String
    tracks:[Track]
  }

  type Track {
    id: ID
    name: String
    band: String
    stars: Int
    playlist: Playlist
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    getAllPlaylists: [Playlist]
    getAllTracks: [Track]
    getPlaylist(id: Int!): Playlist
    getPlaylistWithLimit(limit: Int!): [Playlist]
    getAllTracksByPlaylistId(id: Int!): [Track]
  }

  type Mutation {
    createPlaylist(id: Int, title:String, genre: String ): Playlist
    createTrack(id: Int, name: String, band: String, stars: Int): Track
  }

`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
        getAllPlaylists: () => playlist,
        getAllTracks: () => track,
        getPlaylist: (obj, args, context) => {
            const playlistById = playlist.find(playl => playl.id === args.id);
            if (playlistById === undefined)
                return null;
            else {
                return playlistById;
            }
        },
        getPlaylistWithLimit: (obj, args, context) => {
            limit = [];
            playlist.forEach((item, index) => {
                if (index < args.limit) {
                    limit.push(item);
                }
            });
            return limit;
        },
        getAllTracksByPlaylistId: (obj, args, context) => {
            const tracksFromPlaylist = playlist.find(playl => playl.id === args.id);
            if (tracksFromPlaylist === undefined)
                return null;
            else {
                return tracksFromPlaylist.tracks;
            }
        },
    },

};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});