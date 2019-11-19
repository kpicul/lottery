# Lottery
Simple API for lottery. You can insert the tickets and view the statistics about tickets.

## Prerequisites

* Built with Node.js version 8.10
* Database is Maria db 10.1

## Libraries
* Koa js
* Koa-router
* Koa-body

## Setting up
* Install all libraries through npm
* Create database in mysql or Maria db wih name lottery and user signapps with password signapps.
* Import the database from database.sql file
* Start the app with node router.js

## Description of files
* database.js - includes functions for interacting with database.
* router.js - request handling

## Description of API
* 127.0.0.1:3000/numberstat (GET) - returns statistics about numbers, sorted from the most chosen number to the least chosen
* 127.0.0.1:3000/ticketstat (POST) - returns statistics about tickets. It tells us the statistics about tickets. In the body of the request 
must be json with the winning combination in the key "numbers" - example {"numbers": [11, 18, 32, 34, 55, 16, 27]}
* 127.0.0.1:3000/ticket (POST) - inserts the ticket with the given combination. Combination is given with the same json as in ticketstat request.
It returns the message that the insert was succesfull and the data about inserted ticket (id, time of insertion, date...)
* 127.0.0.1:3000/csv (POST) - Uploads the csv file with combinations. It inserts the combinations in the database and returns us the simple message that 
insert was succesfull. It can be slow for big csv files. Max size of the files is 5000 000 000 Bytes.