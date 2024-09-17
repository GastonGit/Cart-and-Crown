# Create a new migratation

npx sequelize-cli migration:generate --name create-users-table

# Syncing / Running migrations

Dev: Run the command "npm run build && npm run db:sync && npm run db:migrate"
Prod: No need, should be done automatically when running "npm start"
