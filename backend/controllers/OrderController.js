import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from 'stripe';

const currency = 'inr';
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: 'order placed successfully' });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;   //includes frontend url
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name,
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges',
                },
                unit_amount: deliveryCharge*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            // {origin}/verify means frontend_url/verify  (writing this type of url because we created a verify page and added '/verify' in route of app.jsx in frontend)
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        })

        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

const verifyStripePayment = async (req,res) =>{
    const {orderId, success, userId} =req.body;
    try {
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});
            res.json({success:true});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false});
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}

const placeOrderRazor = async (req, res) => {

}

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// for admin
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// for admin
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'status updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, placeOrderRazor, placeOrderStripe, verifyStripePayment, allOrders, userOrders, updateOrderStatus };