import jwt from "jsonwebtoken";

const AdminAuth = async (req,res,next) =>{
    try{
        const {token} = req.headers;
        if(!token){
            return res.json({
                success:false, message:'not authorized admin'
            })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({
                success:false, message:'not authorized admin'
            })
        }
        next();
    }
    catch(error){
        return res.json({
            success:false, message:'not authorized admin'+error.message
        })
    }
}


export default AdminAuth;