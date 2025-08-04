const mongoose = require("mongoose")

const connectDatabase = () => {
    const dbUrl = process.env.DB_URL;
    const options = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        maxIdleTimeMS: 10000,
    };

    const db = mongoose.createConnection(dbUrl, options);

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error.message)}`);
        db.close().catch(() =>
            console.log(`MongoDB :: failed to close connection ${this.name}`)
        );
    });
    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(
                `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
                    query
                )},${JSON.stringify(doc)})`
            );
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });
    return db;
}
const NotifyDB = connectDatabase();
module.exports = { NotifyDB }