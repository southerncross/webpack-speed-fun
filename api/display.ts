import { NowRequest, NowResponse } from '@vercel/node'
import url from 'url'
import { MongoClient } from 'mongodb'

type UserInfo = {
  username: string,
}

type PlatformInfo = {
  platform: string,
  cpu: string,
  memory: number,
}

type BuildInfo = {
  bundleSize: number,
  buildTime: number,
}

let cachedDb = null

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true })

  const db = await client.db(url.parse(uri).pathname.substr(1))

  cachedDb = db
  return db
}

module.exports = async (req: NowRequest, res: NowResponse) => {
  const LIMIT = 100;
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const collection = await db.collection('records')
  const records = await collection.find({}, { limit: LIMIT, skip: Number(req.query.offset) || 0 }).toArray()

  res.status(200).json(records)
}