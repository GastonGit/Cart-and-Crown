import { getSequelize, loadSequelize } from "./connection";

const syncDatabase = async () => {
  try {
    loadSequelize();
    await getSequelize().sync();
    console.log("Successfully synced the database");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  } finally {
    await getSequelize().close();
    console.error("Closed connection to database");
  }
};

syncDatabase();
