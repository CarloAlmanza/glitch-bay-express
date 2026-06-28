import express from 'express';
import cors from 'cors';
import { db } from './config/db.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import invoicesRoutes from './routes/invoices.js';
import usersRoutes from './routes/users.js';
import agent from './routes/agent.js';
import notFound from './middlewares/notFound.js';
import errorsHandler from './middlewares/errorsHandler.js';

const app = express();
const server_port = process.env.SERVER_PORT;
const server_url = process.env.SERVER_URL;

app.use(cors());
app.use(express.static("data/imgs"));
app.use(express.json());

// Rotte
app.use('/agent', agent)
app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/users', usersRoutes);
app.use(errorsHandler);
app.use(notFound);
app.listen(server_port, (error) => {
    if (error) {
        console.error(`ERRORE: la porta ${server_port} è già in utilizzo`);
        return;
    }
    console.log(`🚀 Server running on ${server_url}${server_port}`);
});