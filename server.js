const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

const connection = mysql.createConnection({
  host: 'todo-db.cfieuo4uormz.us-east-1.rds.amazonaws.com',
  port: "3306",
  user: 'admin',
  password: 'itch2544',
  database: 'todords',
});

connection.connect();

app.use(express.json());
app.use(cors());

app.post('/addItem', (req, res) => {
  const { item } = req.body;
  console.log(req.body)
  const sql = 'INSERT INTO myitems (item) VALUES (?)';
  connection.query(sql, [item], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.get('/getAllItems', (req, res) => {
  const sql = 'SELECT * FROM myitems';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      console.log('Data fetched successfully');
      res.status(200).json(results);
      return results
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});