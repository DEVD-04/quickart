import userModel from "../models/UserModel.js";

// we will get req.body.userId from cart middleware and it is the _id that is stored in db
const addToCart = async (req,res) =>{
    try {
        const {userId, itemId, variant} = req.body;
        const userData = await userModel.findById(userId);
        const cartData = await userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][variant]){
                cartData[itemId][variant]+=1;
            }
            else{
                cartData[itemId][variant]=1;
            }
        }
        else{
            cartData[itemId]={};
            cartData[itemId][variant]=1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:'Item added to cart'})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

const updateCart = async (req,res) =>{
    try {
        const {userId, itemId, variant, quantity} = req.body;
        const userData = await userModel.findById(userId);
        const cartData = await userData.cartData;

        cartData[itemId][variant]=quantity;

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:'cart updated'})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

const getCart = async (req,res) =>{
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId);
        const cartData = await userData.cartData;

        res.json({success:true, cartData})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

export {addToCart, updateCart, getCart};