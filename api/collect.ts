import url from 'url'
import { MongoClient } from 'mongodb'

import { UserInfo, PlatformInfo, BuildInfo } from '../types/data'

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

module.exports = async (req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const body = JSON.parse(req.body)
  const userInfo: UserInfo = body.userInfo
  const platformInfo: PlatformInfo = body.platformInfo
  const buildInfo: BuildInfo = body.buildInfo

  const collection = await db.collection('records')
  await collection.insertOne({
    userInfo,
    platformInfo,
    buildInfo,
    created_at: Date.now(),
  })

  res.status(200).json()
}