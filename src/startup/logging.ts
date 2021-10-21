require('express-async-errors');

export default function () {
    process.on('uncaughtException', (ex) => {
        console.error(ex.message, ex);
        process.exit(1);
    });

    process.on('unhandledRejection', (ex) => {
        console.error(ex);
        process.exit(1);
    });
}