import { Types } from "mongoose";
import { cartValid } from "../validators/cart.validate";
import { Cart } from "../interface/cart.interface";
import { newCustomError } from "../midddleware/errorHandler.midleware";
import { productModel } from "../models/product.model";
import { cartModel } from "../models/cart.model";

export class CartService {
  static addToCart = async (data: Cart, customerId: Types.ObjectId) => {
    const { error } = cartValid.validate(data);
    if (error) throw newCustomError(error.message, 400);
    //check id type
    if (!Types.ObjectId.isValid(data.productId)) {
      throw newCustomError("Invalid ProductId", 422);
    }
    //find product
    const product = await productModel
      .findById(new Types.ObjectId(data.productId))
      .lean();
    if (!product) throw newCustomError("No product found", 404);
    //check quantity
    if (data.quantity > product.quantity)
      throw newCustomError("Out of Stock", 422);
    //get user cart
    const cart = await cartModel.findOne({ customerId });
    if (!cart) {
      //create cart
      const response = await cartModel.create({
        customerId,
        items: [
          {
            storeId: product.storeId,
            productId: data.productId,
            productName: product.productName,
            quantity: data.quantity,
            price: product.price,
          },
        ],
        totalPrice: product.price * data.quantity,
      });
      return {
        success: true,
        message: "added to cart",
        data: response,
      };
    } else {
      const rdx = cart?.items.findIndex(
        (item) => item.productId.toString() === data.productId.toString(),
      );
      if (rdx > -1) {
        cart.items[rdx].quantity = data.quantity;
      } else {
        cart.items.push({
          storeId: product.storeId,
          productId: data.productId,
          productName: product.productName,
          quantity: data.quantity,
          price: product.price,
        });
      }
      const sum = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      cart.totalPrice = sum;

      await cart.save();

      return {
        success: true,
        message: "Cart updated",
        data: cart,
      };
    }
  };
}
