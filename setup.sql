CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    discorduid VARCHAR(255),
    credits VARCHAR(255),
    isadmin BOOLEAN,
    pterodactyluid VARCHAR(255),
    isverified BOOLEAN,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS servers(
    id INT NOT NULL AUTO_INCREMENT,
    user VARCHAR(255),
    name VARCHAR(255),
    pteroid VARCHAR(255),
    cost VARCHAR(255),
    planid VARCHAR(255),
    planname VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS j4r(
    id INT NOT NULL AUTO_INCREMENT,
    user VARCHAR(255),
    guildid VARCHAR(255),
    claimed VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS renewals(
    id INT NOT NULL AUTO_INCREMENT,
    user VARCHAR(255),
    serverid VARCHAR(255),
    renewaldate VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS deletions(
    id INT NOT NULL AUTO_INCREMENT,
    user VARCHAR(255),
    serverid VARCHAR(255),
    deletiondate VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS plans(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS config(
    hostname VARCHAR(255),
    panel_url VARCHAR(255),
    pterodactylapikey VARCHAR(255),
    nicehashAddress VARCHAR(255),
    auditlogsurl VARCHAR(255),
    adsenseclient VARCHAR(255),
    adsenseslot VARCHAR(255),
    antiadblock BOOLEAN
);

CREATE TABLE IF NOT EXISTS locations(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(255),
    idonpterodactyl INT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS eggs(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(255),
    idonpterodactyl INT,
    variables MEDIUMTEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS j4r(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(255),
    invite VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS verificationCodes(
    userid INT NOT NULL,
    code VARCHAR(255) NOT NULL,
    PRIMARY KEY (userid)
)

CREATE TABLE IF NOT EXISTS forgetPasswordCodes(
    email INT NOT NULL,
    code VARCHAR(255) NOT NULL,
    PRIMARY KEY (email)
)