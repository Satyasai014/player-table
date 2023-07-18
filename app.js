const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
app.use(express.json());
const databasePath = path.join(__dirname, "cricketMatchDetails.db");
let db = null;

const initializeDatabase = async (request, response) => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Running");
    });
  } catch (e) {
    console.log(`error ${e}`);
  }
};
initializeDatabase();

app.get("/players/", async (request, response) => {
  const sqlQuery = `
    SELECT
      *
    FROM 
    player_details;`;
  response.send(await db.all(sqlQuery));
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const sqlQuery = `
  SELECT
    *
  FROM
  player_details
  WHERE
  player_id=${playerId};`;
  const finalOutput = await db.get(sqlQuery);
  response.send(finalOutput);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName } = request.body;
  const putQuery = `
  UPDATE
  player_details
  SET
  player_name='${playerName}';`;
  const j = await db.run(putQuery);
  response.send("Player Details Updated");
});

app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getMatchQuery = `
  SELECT
    *
  FROM
  match_details;`;
  const matchGet = await db.get(getMatchQuery);
  response.send(matchGet);
});

app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
  SELECT
    *
  FROM
  match_details
  WHERE
  match_id=${playerId};`;
  const kk = await db.get(getPlayerQuery);
  response.send(kk);
});

app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } = request.params;
  console.log(matchId);
  const quwer = `
   SELECT
    player_details.player_id,
    player_name
   FROM
   player_details
   JOIN
   player_match_score
   ON player_details.player_id=player_match_score.player_id
   WHERE player_match_score.match_id = ${matchId};`;
  response.send(await db.all(quwer));
});

app.get("/players/:playerId/playerScores", async (request, response) => {
  const { playerId } = request.params;
  console.log(await playerId);
  const quwer = `
   SELECT
     player_match_score.player_id AS playerId,
     player_details.player_name AS playerName,
     SUM(player_match_score.score) AS totalScore,
     SUM(player_match_score.fours) AS totalFours,
     SUM(player_match_score.sixes) AS totalSixes
   FROM
   player_details
   JOIN
   player_match_score
   ON player_details.player_id=player_match_score.player_id
   WHERE
   player_match_score.player_id =${playerId};`;
  response.send(await db.all(quwer));
});

module.exports = app;
