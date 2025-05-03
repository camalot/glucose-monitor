import { MongoClient, Db, Collection } from 'mongodb';
import config from '../../config/env';

class DatabaseMongoClient<T> {
  private database: string;
  private url: string;
  private client: MongoClient | null;
  protected db: Db | null;
  protected collection: Collection<T>;
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
    if (this.client && this.db) {
      return;
    }
    console.log("Connecting to MongoDB...");
    this.client = await MongoClient.connect(this.url, {});

    console.log("Connected to MongoDB");
    this.db = this.client.db(this.database);
    this.collection = this.db.collection(this.collectionName);
    console.log("Database selected:", this.database);
    console.log("Connection established successfully.");
  }

  async close(): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.close();
    this.client = null;
    this.db = null;
  }
}

export default DatabaseMongoClient;