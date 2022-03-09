import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { getSampleData, generateJsonFile, editColumn, deleteColumn } from './getData';
import { deleteRow } from './deleteRow';
import { addChildRow } from './addChildRow';
import { editRow } from './editRow';
import { addNext } from './addNext';
import { pasteRows } from './pasteChildRow';
import { addColumn } from './addColumn';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const port = 3000;

generateJsonFile();

io.on('connection', (socket) => {

  socket.on('editCol', (formData) => editColumn(formData, socket));

  socket.on('addNewCol', (formData) => addColumn(formData, socket));

  socket.on('delCol', (selectedColumn) => deleteColumn(selectedColumn, socket));

  socket.on('delRow', (selectedRow) => deleteRow(selectedRow, socket));

  socket.on('addChildRow', (selectedRow, rowData) => addChildRow(selectedRow, rowData, socket));

  socket.on('editRow', (selectedRow, rowData) => editRow(selectedRow, rowData, socket));

  socket.on('addNext', (selectedRow, rowData) => addNext(selectedRow, rowData, socket));

  socket.on('paste', (selectedRow, copiedRows, isForChild, hasCutOpPerf) => pasteRows(selectedRow, copiedRows, isForChild, hasCutOpPerf, socket));
  
})

app.get('/get-data', getSampleData);

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});