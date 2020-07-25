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

module.exports = async (req, res) => {
  console.log('boring >>>>', req.body)
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

  const users = await collection.find({}).toArray()

  res.status(200).json()
}