//sirve para configurar la aplicacion de express
//desde aca se hacen todas las inicializaciones de la api

import express from 'express';
import morgan from 'morgan'; //es un middleware de express
import pkg from '../package.json';
import { createRoles } from './libs/initialSetup';  
import productsRoutes from './routes/products.routes'
import authRoutes from './routes/auth.routes'
import usersRoutes from './routes/user.routes';

const app = express();
createRoles();

app.set('pkg', pkg);

app.use(morgan('dev')); //cada vez que yo visito localhost3000 muestra que peticion se hiso por consola

app.use(express.json()); //para que desde express muestre los datos en formato json

app.get('/', (_req, res) => {
    res.json({
        name:app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
})

app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

export default app;