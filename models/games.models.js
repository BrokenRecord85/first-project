const db = require("../db/connection")



exports.provideCategories = () => {
    return db.query("SELECT * FROM categories").then((result) => {
        return result.rows;
      });
}