
There are two databases in this project. One looking for dev data and another one for simpler test data.

To run the databases locally you will need to create two .env files: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
