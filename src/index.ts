import { app } from "./startup/server";

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));