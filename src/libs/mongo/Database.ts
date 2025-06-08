// @ts-nocheck
import { MongoClient, Db, Collection } from 'mongodb';
import config from '../../config/env';

let mongoClientInstance: MongoClient | null = null;
let mongoDbInstance: Db | null = null;

class DatabaseMongoClient<T> {
  private database: string;
  private url: string;
  private client: MongoClient | null;
  protected db: Db | null;
  protected collection: Collection<T> | null;
  protected collectionName: string;

  constructor() {
    this.database = config.mongo.database;
    this.url = config.mongo.url;
    this.client = null;
    this.db = null;
    this.collection = null;
    this.collectionName = '';
  }

  async connect(): Promise<void> {
    if (mongoClientInstance && mongoDbInstance) {
      this.client = mongoClientInstance;
      this.db = mongoDbInstance;
      this.collection = this.db.collection(this.collectionName);
      return;
    }
    console.log("Connecting to MongoDB...");
    this.client = await MongoClient.connect(this.url, {});
    this.db = this.client.db(this.database);
    mongoClientInstance = this.client;
    mongoDbInstance = this.db;
    this.collection = this.db.collection(this.collectionName);
    console.log("Connected to MongoDB");
    console.log("Database selected:", this.database);
    console.log("Connection established successfully.");
  }

  async close(): Promise<void> {
    if (!mongoClientInstance) {
      return;
    }
    await mongoClientInstance.close();
    mongoClientInstance = null;
    mongoDbInstance = null;
    this.client = null;
    this.db = null;
  }
}

export default DatabaseMongoClient;