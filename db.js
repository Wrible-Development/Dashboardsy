import mysql from 'serverless-mysql'
import Axios from 'axios';
import config from './config.json'
import { getCache, setCache } from './lib/cache'

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
})
export async function executeQuery(q, values) {
  try {
    const results = await db.query(q, values)
    await db.end()
    return results
  } catch (e) {
    console.error(e)
    return false;
  }
}

export async function getServers(discord_userid) {
  const cachetest = await getCache(`servers:${discord_userid}`);
  if (cachetest != false) {
    return cachetest;
  } else {
    const re = await executeQuery("SELECT * FROM resources WHERE uid = ?", [discord_userid])
    const pterouid = re[0].ptero_uid
    const pterores = await Axios.get(`https://${config.panel_url}/api/application/users/${pterouid}?include=servers`, {
      headers: {
        "Authorization": `Bearer ${config.panel_apikey}`
      }
    })
    if (pterores.data.attributes.relationships.servers.data.length === 0) {
      setCache(`servers:${discord_userid}`, [], 30);
      return []
    }
    setCache(`servers:${discord_userid}`, pterores.data.attributes.relationships.servers.data, 30);
    return pterores.data.attributes.relationships.servers.data;
  }
}

export async function getCoinsLeaderboard() {
  const ifcacheexists = await getCache('coinsleaderboard');
  if (ifcacheexists != false) {
    return ifcacheexists;
  }
  const clb = await executeQuery("SELECT * FROM resources ORDER BY CAST(coins as INT) DESC LIMIT 10;")
  const coinslb = clb.map(r => JSON.parse(JSON.stringify(r)))
  setCache('coinsleaderboard', coinslb, 300);
  return coinslb;
}

executeQuery("CREATE TABLE IF NOT EXISTS resources(uid VARCHAR(255), cpu VARCHAR(255), memory VARCHAR(255), disk VARCHAR(255), coins VARCHAR(255), serverlimit VARCHAR(255), ptero_uid VARCHAR(255));")
executeQuery("CREATE TABLE IF NOT EXISTS usedresources(uid VARCHAR(255), cpu VARCHAR(255), memory VARCHAR(255), disk VARCHAR(255), ptero_uid VARCHAR(255));")
executeQuery("CREATE TABLE IF NOT EXISTS j4r(uid VARCHAR(255), guildid VARCHAR(255), claimed VARCHAR(255));")
executeQuery("CREATE TABLE IF NOT EXISTS renewals(uid VARCHAR(255), serverid VARCHAR(255), renewaldate VARCHAR(255));")
executeQuery("CREATE TABLE IF NOT EXISTS deletions(uid VARCHAR(255), serverid VARCHAR(255), deletiondate VARCHAR(255));")
