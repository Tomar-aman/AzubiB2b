import mongoose from "mongoose";
import logger from "./logger";

export class Database {
  private readonly mongoURI: string;
  constructor(uri: string) {
    this.mongoURI = uri;
  }

  connect() {
    mongoose
      .connect(this.mongoURI)
      .then(async () => {
        logger.info("Database connection successful");
        await reconcileCompanyIndexes();
      })
      .catch((err) => {
        logger.error("Database connection error", err);
      });
  }
}

/**
 * Idempotent index reconciliation for the `companies` collection.
 *
 * Fachzubi-synced companies may legitimately share an email / company name
 * (multiple Fachzubi companies can use the same email). The legacy schema had
 * GLOBAL unique indexes on `email` and `companyname`, which rejected those
 * syncs with a duplicate-key (11000) error. This replaces them with PARTIAL
 * unique indexes that only apply to azubi-native companies (source: "azubi").
 *
 * Runs automatically on every startup (local + live) and is safe to re-run:
 * it only acts when the old plain indexes are still present.
 */
async function reconcileCompanyIndexes(): Promise<void> {
  try {
    const coll = mongoose.connection.collection("companies");

    // Backfill source on legacy azubi docs so the partial index covers them.
    await coll.updateMany(
      { source: { $in: [null] }, fachzubiId: { $in: [null] } },
      { $set: { source: "azubi" } },
    );
    await coll.updateMany(
      { source: { $exists: false } },
      { $set: { source: "azubi" } },
    );

    const indexes = await coll.indexes();

    // Drop the old GLOBAL unique indexes (non-partial) if they still exist.
    for (const name of ["email_1", "companyname_1"]) {
      const idx = indexes.find((i) => i.name === name);
      if (idx && !idx.partialFilterExpression) {
        await coll.dropIndex(name);
        logger.info(`Dropped legacy global unique index: ${name}`);
      }
    }

    // Ensure the partial (azubi-only) unique indexes exist.
    const hasEmailPartial = indexes.some((i) => i.name === "email_azubi_unique");
    const hasNamePartial = indexes.some(
      (i) => i.name === "companyname_azubi_unique",
    );
    if (!hasEmailPartial) {
      await coll.createIndex(
        { email: 1 },
        {
          unique: true,
          partialFilterExpression: { source: "azubi" },
          name: "email_azubi_unique",
        },
      );
      logger.info("Created partial unique index: email_azubi_unique");
    }
    if (!hasNamePartial) {
      await coll.createIndex(
        { companyname: 1 },
        {
          unique: true,
          partialFilterExpression: { source: "azubi" },
          name: "companyname_azubi_unique",
        },
      );
      logger.info("Created partial unique index: companyname_azubi_unique");
    }
  } catch (err) {
    // Never crash startup over index reconciliation.
    logger.error("reconcileCompanyIndexes failed", err);
  }
}
