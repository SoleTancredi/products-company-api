import {Router} from 'express';
const router = Router();

import * as productsCtrl from '../controllers/products.controllers';
import {authJwt} from '../middlewares';

router.post('/', [authJwt.verifyToken, authJwt.isModerator], productsCtrl.createProduct); //necesita verificar el token y autorizacion de rol moderador

router.get('/', productsCtrl.getProducts); //cualquiera puede acceder a la lista de productos

router.get('/:productId', productsCtrl.getProductById); //cualquiera puede acceder tambien

router.put('/:productId', [authJwt.verifyToken, authJwt.isAdmin], productsCtrl.updateProductById);//necesita verificar el token y autorizacion de rol admin

router.delete('/:productId', [authJwt.verifyToken, authJwt.isAdmin], productsCtrl.deletProductById);

export default router;