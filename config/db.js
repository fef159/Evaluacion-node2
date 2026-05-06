const { Sequelize } = require('sequelize');
require('dotenv').config();

const getConnectionConfig = () => {
  if (process.env.MYSQL_URL) {
    try {
      const url = new URL(process.env.MYSQL_URL);
      return {
        username: url.username,
        password: url.password,
        database: url.pathname.replace(/^\//, ''),
        host: url.hostname,
        port: url.port || 3306
      };
    } catch (error) {
      console.error('Error parsing MYSQL_URL:', error.message);
    }
  }

  return {
    username: process.env.DB_USER || process.env.MYSQL_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE,
    host: process.env.DB_HOST || process.env.MYSQL_HOST || process.env.MYSQLHOST,
    port: process.env.DB_PORT || process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306
  };
};

const config = getConnectionConfig();

if (!config.host || !config.username || !config.password || !config.database) {
  console.error('Missing database connection variables:', {
    host: config.host,
    username: !!config.username,
    password: !!config.password,
    database: config.database
  });
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: 'mysql'
  }
);

module.exports = sequelize;