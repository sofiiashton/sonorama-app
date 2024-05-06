import SQLite from "react-native-sqlite-storage";

// Open the database
const db = SQLite.openDatabase(
  {
    name: "mydatabase.db",
    createFromLocation: "~mydatabase.db",
  },
  () => console.log("Database opened successfully"),
  (error) => console.error("Failed to open database:", error)
);

let initialized = false;

export const initDatabase = () => {
  if (!initialized) {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS playlist (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT, cover TEXT, privacy TEXT DEFAULT "public", description TEXT, tracks TEXT)',
        [],
        () => console.log("Playlist table created successfully"),
        (_, error) =>
          console.error("Error creating playlist table:", error)
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS track (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, artist TEXT, duration TEXT, url TEXT)",
        [],
        () => console.log("Track table created successfully"),
        (_, error) => console.error("Error creating track table:", error)
      );
    });

    initialized = true;
  }
};

export const isDatabaseInitialized = () => {
  return initialized;
};

export const addPlaylist = (playlist) => {
  if (!initialized) {
    console.error(
      "Database is not initialized. Call initDatabase() before adding a playlist."
    );
    return;
  }

  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO playlist (name, url, cover, privacy, description, tracks) VALUES (?, ?, ?, ?, ?, ?)",
      [
        playlist.name,
        playlist.url,
        playlist.cover,
        playlist.privacy,
        playlist.description,
        JSON.stringify(playlist.tracks),
      ],
      (_, results) => {
        console.log("Playlist added successfully");
      },
      (_, error) => {
        console.error("Failed to add playlist:", error);
      }
    );
  });
};

export const getPlaylists = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM playlist",
          [],
          (_, resultSet) => {
            const playlists = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              const item = resultSet.rows.item(i);
              playlists.push({
                id: item.id,
                name: item.name,
                url: item.url,
                cover: item.cover,
                privacy: item.privacy,
                description: item.description,
                tracks: JSON.parse(item.tracks),
              });
            }
            resolve(playlists);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };