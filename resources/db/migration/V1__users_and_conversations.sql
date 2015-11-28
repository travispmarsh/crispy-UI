CREATE TABLE users (
  id            MEDIUMINT    NOT NULL         AUTO_INCREMENT,
  email_address VARCHAR(255) NOT NULL,
  created_date  TIMESTAMP    NOT NULL         DEFAULT CURRENT_TIMESTAMP,
  updated_date  TIMESTAMP    NOT NULL         DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

ALTER TABLE users ADD CONSTRAINT user_email_uniq UNIQUE (email_address);

CREATE TABLE roles (
  id   MEDIUMINT   NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

ALTER TABLE roles ADD CONSTRAINT un_roles_name UNIQUE (name);

INSERT INTO roles (name) VALUES ('admin'), ('coach');

CREATE TABLE user_roles (
  user_id MEDIUMINT NOT NULL,
  role_id MEDIUMINT NOT NULL
)
  ENGINE = InnoDB;

ALTER TABLE user_roles ADD CONSTRAINT fk_ur_users FOREIGN KEY (user_id)
REFERENCES users (id);

ALTER TABLE user_roles ADD CONSTRAINT fk_ur_roles FOREIGN KEY (role_id)
REFERENCES roles (id);

ALTER TABLE user_roles ADD CONSTRAINT un_user_role UNIQUE (user_id, role_id);

CREATE TABLE conversations (
  id           MEDIUMINT NOT NULL AUTO_INCREMENT,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date     DATETIME,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

CREATE TABLE participation_levels (
  id   MEDIUMINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64),
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

ALTER TABLE participation_levels ADD CONSTRAINT un_pl_name UNIQUE (name);

INSERT INTO participation_levels (name)
VALUES ('owner'), ('participant'), ('secretary');

CREATE TABLE conversation_participants (
  id              MEDIUMINT NOT NULL         AUTO_INCREMENT,
  user_id         MEDIUMINT NOT NULL,
  conversation_id MEDIUMINT NOT NULL,
  level_id        MEDIUMINT NOT NULL,
  created_date    TIMESTAMP NOT NULL         DEFAULT CURRENT_TIMESTAMP,
  end_date        DATETIME,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

ALTER TABLE conversation_participants ADD CONSTRAINT fk_cp_levels FOREIGN KEY
  (level_id) REFERENCES participation_levels (id);

ALTER TABLE conversation_participants ADD CONSTRAINT fk_cp_users FOREIGN KEY
  (user_id) REFERENCES users (id);

ALTER TABLE conversation_participants ADD CONSTRAINT fk_cp_conv FOREIGN KEY
  (conversation_id) REFERENCES conversations (id);

CREATE TABLE participation_requests (
  id              MEDIUMINT NOT NULL AUTO_INCREMENT,
  conversation_id MEDIUMINT NOT NULL,
  user_id         MEDIUMINT NOT NULL,
  created_date    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

ALTER TABLE participation_requests ADD CONSTRAINT fk_pr_users FOREIGN KEY
  (user_id) REFERENCES users (id);

ALTER TABLE participation_requests ADD CONSTRAINT fk_pr_conv FOREIGN KEY
  (conversation_id) REFERENCES conversations (id);

ALTER TABLE participation_requests ADD CONSTRAINT un_usr_conv UNIQUE
    (user_id, conversation_id);

CREATE TABLE conversation_messages (
  id           MEDIUMINT NOT NULL AUTO_INCREMENT,
  cp_id        MEDIUMINT NOT NULL, -- Who wrote the message?
  preq_id      MEDIUMINT, -- What Participation Request is this about?
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  message      BLOB,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB;

ALTER TABLE conversation_messages ADD CONSTRAINT fk_cm_part FOREIGN KEY
  (cp_id) REFERENCES conversation_participants (id);

ALTER TABLE conversation_messages ADD CONSTRAINT fk_cm_preq FOREIGN KEY
  (preq_id) REFERENCES participation_requests (id);