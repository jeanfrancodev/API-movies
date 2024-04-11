import mongoose, { Schema } from "mongoose";

export interface IRate extends mongoose.Document {
  stars: number;
  comment: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Rate:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        stars:
 *          type: string
 *        comment:
 *          type: string
 */

const RateSchema = new mongoose.Schema({
  stars: { type: String, required: true },  
  comment: { type: String, required: true },  
  author: { type: Schema.Types.ObjectId,ref:'User'},
  movie: { type: Schema.Types.ObjectId,ref:'Movie'},
  createdAt: {type: Date, default: Date.now()}
});

export default mongoose.model<IRate>("Rate", RateSchema);