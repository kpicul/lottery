DROP TABLE IF EXISTS ticket_number;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS number;

CREATE TABLE ticket(
  id_ticket VARCHAR(40) PRIMARY KEY,
  date_added DATE NOT NULL,
  time_added TIME NOT NULL
);

CREATE TABLE number(
  number_name INTEGER PRIMARY KEY
);

CREATE TABLE ticket_number(
    id_ticket VARCHAR(40),
    number INTEGER,
    CONSTRAINT `fk_ticket`
        FOREIGN KEY (id_ticket) REFERENCES ticket(id_ticket),
    CONSTRAINT `fk_number`
        FOREIGN KEY (number) REFERENCES number(number_name)
);

INSERT INTO number(number_name) VALUE (1);
INSERT INTO number(number_name) VALUE (2);
INSERT INTO number(number_name) VALUE (3);
INSERT INTO number(number_name) VALUE (4);
INSERT INTO number(number_name) VALUE (5);
INSERT INTO number(number_name) VALUE (6);
INSERT INTO number(number_name) VALUE (7);
INSERT INTO number(number_name) VALUE (8);
INSERT INTO number(number_name) VALUE (9);
INSERT INTO number(number_name) VALUE (10);
INSERT INTO number(number_name) VALUE (11);
INSERT INTO number(number_name) VALUE (12);
INSERT INTO number(number_name) VALUE (13);
INSERT INTO number(number_name) VALUE (14);
INSERT INTO number(number_name) VALUE (15);
INSERT INTO number(number_name) VALUE (16);
INSERT INTO number(number_name) VALUE (17);
INSERT INTO number(number_name) VALUE (18);
INSERT INTO number(number_name) VALUE (19);
INSERT INTO number(number_name) VALUE (20);
INSERT INTO number(number_name) VALUE (21);
INSERT INTO number(number_name) VALUE (22);
INSERT INTO number(number_name) VALUE (23);
INSERT INTO number(number_name) VALUE (24);
INSERT INTO number(number_name) VALUE (25);
INSERT INTO number(number_name) VALUE (26);
INSERT INTO number(number_name) VALUE (27);
INSERT INTO number(number_name) VALUE (28);
INSERT INTO number(number_name) VALUE (29);
INSERT INTO number(number_name) VALUE (30);
INSERT INTO number(number_name) VALUE (31);
INSERT INTO number(number_name) VALUE (32);
INSERT INTO number(number_name) VALUE (33);
INSERT INTO number(number_name) VALUE (34);
INSERT INTO number(number_name) VALUE (35);
INSERT INTO number(number_name) VALUE (36);
INSERT INTO number(number_name) VALUE (37);
INSERT INTO number(number_name) VALUE (38);
INSERT INTO number(number_name) VALUE (39);
INSERT INTO number(number_name) VALUE (40);
INSERT INTO number(number_name) VALUE (41);
INSERT INTO number(number_name) VALUE (42);
INSERT INTO number(number_name) VALUE (43);
INSERT INTO number(number_name) VALUE (44);
INSERT INTO number(number_name) VALUE (45);
INSERT INTO number(number_name) VALUE (46);
INSERT INTO number(number_name) VALUE (47);
INSERT INTO number(number_name) VALUE (48);
INSERT INTO number(number_name) VALUE (49);
INSERT INTO number(number_name) VALUE (50);
INSERT INTO number(number_name) VALUE (51);
INSERT INTO number(number_name) VALUE (52);
INSERT INTO number(number_name) VALUE (53);
INSERT INTO number(number_name) VALUE (54);
INSERT INTO number(number_name) VALUE (55);
INSERT INTO number(number_name) VALUE (56);
INSERT INTO number(number_name) VALUE (57);
INSERT INTO number(number_name) VALUE (58);
INSERT INTO number(number_name) VALUE (59);
INSERT INTO number(number_name) VALUE (60);