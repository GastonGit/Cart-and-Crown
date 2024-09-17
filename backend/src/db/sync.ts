import sequelize from "./connection";

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Successfully synced the database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
