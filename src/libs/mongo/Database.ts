import { MongoClient, Db } from 'mongodb';
import config from '../../config/env';

class DatabaseMongoClient {
  private database: string;
  private url: string;
  private client: MongoClient | null;
  protected db: Db | null;

  constructor() {
    this.database = config.mongo.database;
    this.url = config.mongo.url;
    this.client = null;
    this.db = null;
  }

  async connect(): Promise<void> {
    if (this.client && this.db) {
      return;
    }
    this.client = await MongoClient.connect(this.url, {});
    this.db = this.client.db(this.database);
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


// const { MongoClient } = require('mongodb');
// const config = require('../../config');
// class DatabaseMongoClient {
//   constructor() {
//     this.database = config.mongo.database;
//     this.url = config.mongo.url;
//     this.client = null;
//     this.db = null;
//   }

//   async connect() {
//     if (this.client && this.db) {
//       return;
//     }
//     this.client = await MongoClient.connect(this.url, {});
//     this.db = this.client.db(this.database);
//   }

//   async close() {
//     if (!this.client) {
//       return;
//     }
//     await this.client.close();
//     this.client = null;
//     this.db = null;
//   }
// }

// module.exports = DatabaseMongoClient;