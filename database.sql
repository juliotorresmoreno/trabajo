create database keos;
use keos;

CREATE TABLE users (
    id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    gender      ENUM("male", "female") NOT NULL,
    firstname   VARCHAR(255) NOT NULL,
    lastname    VARCHAR(255) NOT NULL,
    email       VARCHAR(100) NOT NULL,
    picture     TEXT NOT NULL
);