import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) =>{
    const {token} =req.headers;
    if(!token){
        return res.json({success:false, message:'Not Authorized to access cart'});
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // this token_decode is user._id which is stored in db
        // sending this _id in req.body for further use
        req.body.userId = token_decode.id;  
        next();
    } 
    catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

export default authUser;