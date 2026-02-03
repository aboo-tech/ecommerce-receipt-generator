import { Types } from "mongoose";
import { IProduct } from "../interface/product.interface";
import { newCustomError } from "../midddleware/errorHandler.midleware";
import { productModel } from "../models/product.model";
import { prdt } from "../validators/product.validate";
import { storeModel } from "../models/store.model";

export class ProductService {
  static createProduct = async (product: IProduct, userId: Types.ObjectId) => {
    const { error } = prdt.validate(product);
    if (error) throw newCustomError(error.message, 400);
    //check price
    if (product.price < 0) {
      throw newCustomError("Price must be greater than 9", 409);
    }
    //create a slug
    const slug = product.productName.toLowerCase().trim().replace(/\s+/g, "-");
    //storeId
    const store = await storeModel.findOne({ userId });
    //chek if product exist
    const isProductExist = await productModel
      .findOne({ slug, storeId: store?._id })
      .populate({
        path: "storeId",
        model: "Store",
      });
    if (isProductExist) throw newCustomError("Product already exist", 422);
    //create product
    const response = await productModel.create({
      ...product,
      storeId: store?._id,
      slug,
    });
    if (!response) throw newCustomError("Unable to create a new product", 409);
    return "New product added";
  };
}
