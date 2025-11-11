import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Electrician from './models/Electrician.js';
import Client from './models/Client.js';
import Product from './models/Product.js';
import Service from './models/Service.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@eletrigo.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Database connection with memory fallback
const uri = process.env.MONGODB_URI;
let dbStatus = 'disconnected';
let dbMode = 'remote';
let mongod; // memory server instance

async function connectDB() {
  try {
    if (!uri) {
      // No URI provided: start in-memory MongoDB
      dbMode = 'memory';
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, { dbName: 'eletrigo' });
      dbStatus = 'connected';
      console.log('[DB] Conectado ao MongoDB (memória)');
    } else {
      // Try remote first; on failure, fallback to memory
      try {
        await mongoose.connect(uri, { dbName: 'eletrigo' });
        dbStatus = 'connected';
        dbMode = 'remote';
        console.log('[DB] Conectado ao MongoDB (remoto)');
      } catch (remoteErr) {
        console.error('[DB] Falha ao conectar no MongoDB remoto, caindo para memória:', remoteErr.message);
        dbMode = 'memory';
        mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri, { dbName: 'eletrigo' });
        dbStatus = 'connected';
        console.log('[DB] Conectado ao MongoDB (memória)');
      }
    }
  } catch (err) {
    dbStatus = 'error';
    console.error('[DB] Erro ao conectar no MongoDB:', err.message);
  }
}

connectDB();

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
  }
  process.exit(0);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: dbStatus, mode: dbMode });
});

// Admin auth (simple env-based)
app.post('/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '12h' });
      return res.json({ ok: true, token });
    }
    return res.status(401).json({ error: 'Credenciais inválidas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Electricians
app.get('/electricians', async (req, res) => {
  try {
    const list = await Electrician.find().sort({ joinDate: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/electricians', async (req, res) => {
  try {
    const electrician = new Electrician(req.body);
    await electrician.save();
    res.status(201).json(electrician);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update electrician (partial)
app.put('/electricians/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Electrician.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Electrician not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Clients
app.get('/clients', async (req, res) => {
  try {
    const list = await Client.find().sort({ joinDate: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/clients', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update client (partial)
app.put('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Client.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Client not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Products
app.get('/products', async (req, res) => {
  try {
    const list = await Product.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product (partial)
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Services
app.get('/services', async (req, res) => {
  try {
    const list = await Service.find().sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update service (partial)
app.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Service.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[API] Servidor rodando em http://localhost:${PORT}`);
});