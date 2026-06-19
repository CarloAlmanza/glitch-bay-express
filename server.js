import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import invoicesRoutes from './routes/invoices.js';
import usersRoutes from './routes/users.js';

const app = express();
const server_port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

// Rotte
app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/users', usersRoutes);

app.listen(server_port, (error) => {
    if (error) {
        console.error(`ERRORE: la porta ${server_port} è già in utilizzo`);
        return;
    }
    console.log(`🚀 Server running on http://localhost:${server_port}`);
});