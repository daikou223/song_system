const express = require("express");
const { Client } = require("pg");

const app = express();
const cors = require("cors");
const crypto = require("crypto");

DEPLOY_URL = "localhost:8080"
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

const client = new Client({
  user: "myuser",
  host: "localhost",
  database: "data_20260405",
  password: "strongpassword",
  port: 5432,
});

client.connect();

// =========================
// READ all
// GET /songs
// =========================
app.get("/songs", async (req, res) => {
  try {
    const isMock = req.query.isMock === "false" ? false : true;
    const keyword = req.query.keyword ?? "";

    const result = await client.query(
      `SELECT * FROM songs
LEFT JOIN (
  SELECT
    song_id,
    MAX(sung_at) as last_sung_at,
    MAX(id) as historyId
  FROM histories
  GROUP BY song_id
) as history_stats
ON songs.id = history_stats.song_id
WHERE songs.is_mock = $1
AND songs.title LIKE '%' || $2 || '%'
ORDER BY history_stats.historyId DESC`,
      [isMock, keyword],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

// =========================
// READ one
// GET /song/:id
// =========================
app.get("/song/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isMock = req.query.isMock === "false" ? false : true;
    const userId = req.query.userId;
    const result = await client.query(
      `SELECT
songs.id as song_id,
songs.title,
songs.artist,
songs.music_url,
songs.lyrics_url,
histories.id as history_id,
histories.sung_at,
histories.memo

FROM songs

LEFT JOIN histories
ON histories.song_id = songs.id
AND histories.user_id = $2

WHERE songs.id = $1`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("not found");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

// =========================
// CREATE
// POST /song
// =========================
app.post("/song", async (req, res) => {
  try {
    const isMock = req.query.isMock === "false" ? false : true;
    const { title, artist, lyrics_url, music_url } = req.body;

    const result = await client.query(
      `
      INSERT INTO songs(
        title,
        artist,
        lyrics_url,
        music_url,
        is_mock
      )
      VALUES($1,$2,$3,$4,$5)
      `,
      [title, artist, lyrics_url, music_url, isMock],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.put("/song",async (req,res)=>{
  try {
    const { title, artist,songId } = req.body;

    const result = await client.query(
      `
      update songs set title=$1,artist=$2 where id=$3
      `,
      [title, artist,songId],
    );
    console.log(result)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
})
// =========================
// READ all
// GET /setlists
// =========================
app.get("/setlists", async (req, res) => {
  try {
    const isMock = req.query.isMock === "false" ? false : true;
    const userId = req.query?.userId ?? 1;
    const onlySelf = req.query?.onlySelf === "false" ? false : true;

    const result = await client.query(
      `SELECT 
      setlists.id as setlist_id,
      setlists.title as setlist_title,
      songs.id,
      songs.title,
      setlists.user_id,
      users.user_name,
      setlists.is_public
      FROM setlist_songs 
      JOIN songs ON setlist_songs.song_id = songs.id and songs.is_mock = $1
      RIGHT JOIN setlists ON setlist_songs.setlist_id = setlists.id 
        JOIN users ON users.id = setlists.user_id
      WHERE setlists.user_id = $2 ORDER BY setlists.id`,
      [isMock, userId],
    );

    if(onlySelf){res.json([...result.rows])};
    const otherResult = await client.query(
      `SELECT
  s.id as setlist_id,
  s.title as setlist_title,
  so.id as song_id,
  so.title as song_title,
  s.user_id,
  users.user_name,
  s.is_public
FROM user_setlists us
JOIN setlists s
  ON us.setlist_id = s.id
LEFT JOIN setlist_songs ss
  ON s.id = ss.setlist_id
LEFT JOIN songs so
  ON ss.song_id = so.id
 AND so.is_mock = $1
  JOIN users ON users.id = s.user_id
WHERE us.user_id = $2
ORDER BY s.id`,
      [isMock, userId],
    );

    res.json([...result.rows,...otherResult.rows]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

// =========================
// READ all
// GET /setlist
// =========================
app.get("/setlist/:setlistId", async (req, res) => {
  try {
    const setlistId = req.params.setlistId;
    const isMock = req.query.isMock === "false" ? false : true;
    const result = await client.query(
      `SELECT 
      setlists.id as setlist_id,
      setlists.title as setlist_title,
      songs.id,
      songs.title,
      songs.artist,
      setlists.user_id,
      users.user_name,
      setlists.is_public,
      setlists.share_key,
      last_sung_at
      FROM setlist_songs 
      JOIN songs ON setlist_songs.song_id = songs.id and songs.is_mock = $1
      RIGHT JOIN setlists ON setlist_songs.setlist_id = setlists.id 
      LEFT JOIN (
  SELECT
    song_id,
    MAX(sung_at) as last_sung_at
  FROM histories
  GROUP BY song_id
) as history_stats
 ON songs.id = history_stats.song_id
 JOIN users ON users.id = setlists.user_id
      WHERE setlists.id = $2 
      ORDER BY setlists.id`,
      [isMock, setlistId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/is_save",
  async (req, res) => {
  try {
    const setlistId = req.query.setlistId;
    const userId = req.query.userId;
    const result = await client.query(
      `SELECT 
        count(*) > 0 as is_saving
        from user_setlists
      WHERE setlist_id = $2  and user_id = $1
      group BY setlist_id`,
      [userId, setlistId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.post("/is_save",
  async (req, res) => {
  try {
    const setlistId = req.body.setlistId;
    const userId = req.body.userId;
    const result = await client.query(
      `INSERT INTO user_setlists(user_id,setlist_id) values ($1,$2)`,
      [userId, setlistId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});
// =========================
// CREATE
// POST /setlist
// =========================
app.post("/setlist", async (req, res) => {
  try {
    const { user_id, title } = req.body;

    const key = crypto.randomBytes(16).toString("hex");
    const result = await client.query(
      `
      INSERT INTO setlists(
       user_id,
      title,
      is_public,
      share_key
      )
      VALUES($1,$2,$3,$4)
      `,
      [user_id, title, true,key],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

// =========================
// PUT
// POST /setlist
// =========================
app.put("/setlist/:songId", async (req, res) => {
  try {
    const songId = req.params.songId;
    const { setLists } = req.body;
    const result = await client.query(
      `SELECT 
      setlist_id
      FROM setlist_songs
      where song_id = $1`,
      [songId],
    );

    const currentSetlistIds = new Set(result.rows.map((row) => row.setlist_id));

    const insertIds = [];
    const deleteIds = [];

    for (const setList of setLists) {
      const exists = currentSetlistIds.has(setList.id);

      // false -> true
      if (setList.isInclude && !exists) {
        insertIds.push(setList.id);
      }

      // true -> false
      if (!setList.isInclude && exists) {
        deleteIds.push(setList.id);
      }
    }

    if (insertIds.length > 0) {
      const values = [];
      const params = [];

      insertIds.forEach((id) => {
        values.push(`($${params.length + 1},$${params.length + 2})`);

        params.push(id, songId);
      });

      await client.query(
        `
    INSERT INTO setlist_songs(
      setlist_id,
      song_id
    )
    VALUES ${values.join(",")}
    `,
        params,
      );
    }

    if (deleteIds.length > 0) {
      await client.query(
        `
    DELETE FROM setlist_songs
    WHERE song_id = $1
    AND setlist_id = ANY($2)
    `,
        [songId, deleteIds],
      );
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

// =========================
// delete
// DELETE /setList
// =========================
app.delete("/setlist/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.query?.userId ?? 1;

    const result = await client.query(
      `delete FROM setlists WHERE id = $1;
      delete FROM setlist_songs WHERE setlist_id = $1`,
      [id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.post("/authSetList",async(req,res)=>{
  try{
    const setListId = req.body?.setListId;
    const setListKey = req.body?.setListKey;
    const result = await client.query(
      `SELECT 
      id
      FROM  setlists
      where id = $1 AND share_key = $2`,
      [setListId,setListKey ],
    );
    res.json(result.rows.length == 1);
  }catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
})
// =========================
// READ all
// GET /history
// =========================
app.get("/history", async (req, res) => {
  const orderParamBuilder = (order) => {
    switch (order) {
      case "more":
        return "sing_count DESC";
      case "low":
        return "sing_count";
      default:
        return "last_sung_at DESC";
    }
  };
  try {
    const isMock = req.query.isMock === "false" ? false : true;
    const userId = req.query?.userId ?? 1;
    const order = req.query?.order;
    const orderParam = orderParamBuilder(order);
    const result = await client.query(
      `SELECT
  songs.id,
  songs.title,
  songs.artist,
  COUNT(*) as sing_count,
  MAX(histories.sung_at) as last_sung_at
FROM histories
JOIN songs
ON histories.song_id = songs.id

WHERE songs.is_mock = $1
AND histories.user_id = $2

GROUP BY
  songs.id,
  songs.title,
  songs.artist

ORDER BY ${orderParam}`,
      [isMock, userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

// =========================
// CREATE
// POST /history
// =========================
app.post("/history", async (req, res) => {
  try {
    const { sung_at, memo, song_id, user_id } = req.body;

    const result = await client.query(
      `
      INSERT INTO histories(
       user_id,
      song_id,
      memo,
      sung_at
      )
      VALUES($1,$2,$3,$4)
      `,
      [user_id, song_id, memo, sung_at],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/login", async (req, res) => {
  try {
    const userHash = req.query.user_hash;
    const user = await loginFetch(userHash);

    if (user) {
      return res.json({
        userId: user.userId,
        userHash,
        userName: user.userName,
      });
    }

    const newUser = await createUser();

    return res.json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("error");
  }
});

const loginFetch = async (hash) => {
  if (!hash) {
    return null;
  }

  const result = await client.query(
    `
    SELECT id, user_name
    FROM users
    WHERE user_hash = $1
    `,
    [hash],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    userId: result.rows[0].id,
    userName: result.rows[0].user_name,
  };
};

const createUser = async () => {
  const newHash = crypto.randomBytes(32).toString("hex");
  const result = await client.query(
    `
    insert into users (user_name,user_one_time,user_hash) values ($1,$2,$3) returning id
    `,
    ["NoNameUser", null, newHash],
  );
  const userId = result.rows[0].id;
  return { userId, userHash: newHash, userName: "NoNameUser" };
};

app.post("/userName", async (req, res) => {
  try {
    const userHash = req.body.userHash;
    const userName = req.body.userName;
    const user = await loginFetch(userHash);

    if (user) {
      const result = await client.query(
        `
          update users set user_name = $1
          WHERE id = $2
          `,
        [userName, user.userId],
      );
      return res.status(200).json({});
    } else {
      return res.status(500).send("noUserError");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("error");
  }
});
app.listen(2604, () => {
  console.log("Server running on 2604");
});
