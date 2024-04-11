import mongoose, { Schema } from "mongoose";

export interface IMovie extends mongoose.Document {
  title: string;
  synopsis: string;
  trailer:string;
  studios: string;
  year: number;
  duration: string;
  genre: Array<String>;
  image?: string;
  ageClassification: number;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Movie:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        title:
 *          type: string
 *        synopsis:
 *          type: string
 *        trailer:
 *          type: string
 *        studios:
 *          type: string
 *        year:
 *          type: string
 *        duration:
 *          type: string
 *        genre:
 *          type: array
 *          items:
 *            type: string
 *        image:
 *          type: string
 *        ageClassification:
 *          type: number
 *        rates: 
 *          type: array
 */
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  synopsis: { type: String, required: true },  
  trailer: { type: String, required: true },
  studios: { type: String, required: true  }, 
  year: { type: String, required: true }, 
  duration: { type: String, required: true },
  genre: { type: Array<String>, required: true },
  image: { type: String, default: "default.png"},
  ageClassification: { type: Number, required: true },
  createdAt: {type: Date, default: Date.now()},
  rates:[ {type: Schema.Types.ObjectId, ref:'Rate'}]
});
export default mongoose.model<IMovie>("Movie", MovieSchema);