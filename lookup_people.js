const args = process.argv[2];
const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
    user: settings.user,
    password: settings.password,
    database: settings.database,
    host: settings.hostname,
    port: settings.port,
    ssl: settings.ssl
});

client.connect((err) => {
    if (err) {
        return console.error("Connection Error", err);
    }
    client.query(`SELECT * FROM famous_people WHERE first_name = '${args}' OR last_name = '${args}'`, (err, result) => {
        if (err) {
            return console.error("error running query", err);
        }
        printResult(result);
        client.end();
    });
});

const printResult = function(result) {

    const header = `Found ${result.rowCount} person(s) by the name '${args}':`;
    console.log(header);
    for (let i = 0; i < result.rowCount; i++) {
        let person = result.rows[i];

        let line = `${i+1}: ${person.first_name} ${person.last_name}, born '${person.birthdate.toISOString().substring(0, 10)}'`;
        console.log(line);
    }
}