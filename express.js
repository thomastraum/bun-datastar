const express = require("express");
const { randomBytes } = require("crypto");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const backendData = {};

function indexPage() {
  const indexPage = `
    <!doctype html><html>
      <head>
        <title>Node/Express + Datastar Example</title>
        <script type="module" defer src="https://cdn.jsdelivr.net/npm/@sudodevnull/datastar"></script></head>
      <body>
        <h2>Node/Express + Datastar Example</h2>
        <main class="container" id="main"></main>
      </body>
    </html>`;
  return indexPage;
}

app.get("/", (req, res) => {
  res.send(indexPage()).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});s