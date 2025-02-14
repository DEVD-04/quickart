import express from 'express';
import {placeOrder,placeOrderRazor,placeOrderStripe,allOrders,userOrders,updateOrderStatus, verifyStripePayment} from '../controllers/OrderController.js';
import AdminAuth from '../middleware/AdminAuth.js';
import authUser from '../middleware/Auth.js';


const orederRouter = express.Router();

orederRouter.post('/list', AdminAuth, allOrders);
orederRouter.post('/status', AdminAuth, updateOrderStatus);

orederRouter.post('/place', authUser, placeOrder);
orederRouter.post('/stripe', authUser, placeOrderStripe);
orederRouter.post('/razor', authUser, placeOrderRazor);

orederRouter.post('/userorders', authUser, userOrders);

//verify payment
orederRouter.post('/verifystripe', authUser, verifyStripePayment);

export default orederRouter;
