import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, require:true},
    description: {type: String, require:true},
    price: {type: Number, require:true},
    image: {type: Array, require:true},
    category: {type: String, require:true},
    variant: {type: Array, require:true},
    bestseller: {type: Boolean},
    date: {type:Number, require:true}
})

//when we run project this model will be created multiple times.
// but we can create model only once
// so add :: mongoose.models.product
// when product model already avaliable that will be used, otherwise new will be created
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;