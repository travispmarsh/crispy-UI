CREATE DATABASE IF NOT EXISTS taters DEFAULT CHARACTER SET utf8;
CREATE USER 'tater_dev' IDENTIFIED BY 'password';
GRANT ALL ON taters.* to 'tater_dev';
FLUSH PRIVILEGES;