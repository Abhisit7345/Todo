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
  const { item, category } = req.body;
  const sql = 'INSERT INTO myitems (item, category) VALUES (?, ?)';
  connection.query(sql, [item, category], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log(results)
      console.log('Data inserted successfully');
      console.log(results.insertId)
      res.status(200).json({ message: 'Data inserted successfully', itemId : results.insertId });
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

app.delete('/deleteItem/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const sql = 'DELETE FROM myitems WHERE id = ?';
  connection.query(sql, [itemId], (error, results) => {
    if (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Error deleting data' });
    } else {
      console.log('Data deleted successfully');
      res.status(200).json({ message: 'Data deleted successfully' });
    }
  });
});

app.put('/updateItem/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const { newItem } = req.body;
  const sql = 'UPDATE myitems SET item = ? WHERE id = ?';
  connection.query(sql, [newItem, itemId], (error, results) => {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Error updating data' });
    } else {
      if (results.affectedRows === 0) {
        // If no rows were affected, it means there was no item with the given ID
        res.status(404).json({ message: 'Item not found' });
      } else {
        console.log('Data updated successfully');
        res.status(200).json({ message: 'Data updated successfully' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});