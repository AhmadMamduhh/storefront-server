
# Storefront Backend Project

# Installation Guide
1- Run yarn install to download all necessary packages.
2- Update the .env file to include the properties of your local database server (POSTGRES_HOST, POSTGRES_USER, POSTGRES_DB, POSTGRES_DB_TEST, POSTGRES_PASSWORD).
3- Update the database.json file to include the same properties as above.
4- Run yarn db-migrate-up script to create all the tables necessary.
5- Run yarn test to run all test scripts.
6- Run yarn watch to run the server.

NOTE: Please review and update the script for testing based on the requirements of your operating system. 

# Environment Variables

    POSTGRES_HOST=localhost
    POSTGRES_USER=postgres
    POSTGRES_DB=storefront
    POSTGRES_DB_TEST=storefront_test
    POSTGRES_PASSWORD=Ahmed@123
    ENV=dev
    BCRYPT_PEPPER=random-password-pepper
    SALT_ROUNDS=10
    JWT_TOKEN_SECRET=ssaxauhsqkdhwhdkqwb152!

# package.json scripts
"start": "node src/server.ts" (starts the server),

"watch": "tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess 
\"node ./dist/server.js\" (starts the server and watches for changes),

"build": "npx tsc --outDir ./dist" (builds the project, converts TS into JS, saves output in ./dist folder),

"db-migrate-up": "db-migrate up" (Performs the up migration which is to create the tables defined in the schema),

"db-migrate-down": "db-migrate down --count 4" (performs the down migration which is to drop the tables defined in the schema),

"db-migrate-up-test": "db-migrate --env test up" (performs the up migration on the test database),

"db-migrate-down-test": "db-migrate --env test down --count 4" (performs the down migration on the test database),

"test": "export ENV=test&& yarn db-migrate-down-test && yarn db-migrate-up-test && jasmine-ts && yarn db-migrate-down-test" (down migrates the test DB, up migrates the test DB, then runs the tests defined in the tests folder then down migrates the test DB)

# Ports
Server runs on port 3003
Database on port 5432


# API endpoints
All endpoints are described in the REQUIREMENT.md file.

Authentication tokens are passed in the HTTP header in this format: 'Authorization: Bearer `token`'

# Requirements File
In order to view the requirements file, please make sure to use a markdown viewer such as: https://onlinemarkdowneditor.dev/ 
This is to ensure the good presentation and styling of the API endpoints and Database schema documentation.
