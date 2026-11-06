import app, { connect } from "./app.js";

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  connect(); // connect to db
  console.log(`Running on ${PORT}`);
});
