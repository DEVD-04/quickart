import express from 'express';
import {placeOrder,placeOrderRazor,placeOrderStripe,allOrders,userOrders,updateOrderStatus, verifyStripePayment} from '../controllers/OrderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/Auth.js';


const orederRouter = express.Router();

orederRouter.post('/list', adminAuth, allOrders);
orederRouter.post('/status', adminAuth, updateOrderStatus);

orederRouter.post('/place', authUser, placeOrder);
orederRouter.post('/stripe', authUser, placeOrderStripe);
orederRouter.post('/razor', authUser, placeOrderRazor);

orederRouter.post('/userorders', authUser, userOrders);

//verify payment
orederRouter.post('/verifystripe', authUser, verifyStripePayment);

export default orederRouter;
