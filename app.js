const {
    ApolloServer,
    gql
} = require('apollo-server');

const playlist = [{
        id: 11,
        title: 'I\'m cool',
        genre: 'Rock',
        tracks: []
    },
    {
        id: 12,
        title: 'I wanna cry',
        genre: 'Blues',
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

playlist.forEach((item, index) => {
    item.tracks.push(track[index * 2]);
    item.tracks.push(track[(index * 2) + 1]);
});

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

  enum Genre {
    Blues
    Jazz
    Rock
  }

  input playlistInput{
    id: Int!
    title:String!
    genre: Genre!
  }

  input trackInput{
    id: Int!
    name: String!
    band: String!
    stars: Int!
    playlistId: Int!
  }

  type Query {
    getAllPlaylists: [Playlist]
    getAllTracks: [Track]
    getPlaylistById(id: Int!): Playlist
    getTrackById(id: Int!): Track
    getPlaylistWithLimit(limit: Int!): [Playlist]
    getAllTracksByPlaylistId(id: Int!): [Track]
  }

  type Mutation {
    createPlaylist(input: playlistInput): Playlist
    createTrack(input: trackInput): Track
  }

`;

const resolvers = {
    Query: {
        getAllPlaylists: () => playlist,
        getAllTracks: () => track,
        getPlaylistById: (obj, args) => {
            const playlistById = playlist.find(playl => playl.id === args.id);
            if (playlistById === undefined)
                return null;
            else {
                return playlistById;
            }
        },
        getTrackById: (obj, args) => {
            const trackById = track.find(item => item.id === args.id);
            if (trackById === undefined)
                return null;
            else {
                return trackById;
            }
        },
        getPlaylistWithLimit: (obj, args) => {
            limit = [];
            playlist.forEach((item, index) => {
                if (index < args.limit) {
                    limit.push(item);
                }
            });
            return limit;
        },
        getAllTracksByPlaylistId: (obj, args) => {
            const tracksFromPlaylist = playlist.find(playl => playl.id === args.id);
            if (tracksFromPlaylist === undefined)
                return null;
            else {
                return tracksFromPlaylist.tracks;
            }
        }
    },
    Mutation: {
        createPlaylist: (obj, args) => {
            const newPlaylist = {};
            newPlaylist.id = args.input.id;
            newPlaylist.title = args.input.title;
            newPlaylist.genre = args.input.genre;
            newPlaylist.tracks = [];
            playlist.push(newPlaylist);
            return newPlaylist;
        },
        createTrack: (obj, args) => {
            const newTrack = {};
            let p = null;
            newTrack.id = args.input.id;
            newTrack.name = args.input.name;
            newTrack.band = args.input.band;
            newTrack.stars = args.input.stars;
            p = playlist.find(playl => playl.id === args.input.playlistId);
            if (p !== null) {
                newTrack.playlist = p;
                p.tracks.push(newTrack);
            } else {
                newTrack.playlist = playlist[0];
                playlist[0].tracks.push(newTrack);
            }
            track.push(newTrack);
            return newTrack;
        }

    }

};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});