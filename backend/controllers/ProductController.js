import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/ProductModel.js';

const addProduct = async (req,res) =>{
    try{
        const {name, description, price, category, variant, bestseller} = req.body;

        const img1 = req.files.image1 && req.files.image1[0];
        const img2 = req.files.image2 && req.files.image2[0];
        const img3 = req.files.image3 && req.files.image3[0];
        const img4 = req.files.image4 && req.files.image4[0];

        const images = [img1, img2,img3,img4].filter((item)=> item!==undefined);
        // console.log(images)

        let imagesURL = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                return result.secure_url;
            })
        )
        // console.log(imagesURL);

        const productData = {
            name, description, category, price: Number(price),
            // in productmodel variant is array
            // when we send it via form it goes as json_string
            // from that json string we need to get array(model format)
            // at frontend we are giving array of string. in middleway it converted in jsonstring
            // while saving we need to hevt it in array
            variant : JSON.parse(variant),
            bestseller : bestseller==='true' ? true : false,
            image: imagesURL,
            date: Date.now()
        }
        console.log(productData);
        const product = new productModel(productData);
        await product.save();

        // console.log(name, description, price, category, variant, bestseller);
        // console.log(img1, img2, img3, img4);

        res.json({
            success:true, message:'product added succesfully'
        })
        
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:'error while adding product : '+error.message})
    }
}

const listProducts = async (req,res) =>{
    try{
        const products = await productModel.find({});
        res.json({
            success:true, products
        })

    } catch(error){
        console.log(error);
        res.json({success:false, message:'error while listing product : '+error.message})
    }
}

const removeProduct = async (req,res) =>{
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({
            success:true, message:'removed product with id:'+req.body.id
        })
    } catch (error) {
        console.log(error);
        res.json({success:false, message:'error while removing product : '+error.message})
    }
}

const singleProduct = async (req,res) =>{
    try{
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({
            success:true, product
        })

    } catch(error){
        console.log(error);
        res.json({success:false, message:'error while viewing single product : '+error.message})
    }
}

export {addProduct, listProducts, removeProduct, singleProduct};