import mongoose from "mongoose";

export interface IMovie extends mongoose.Document {
  title: string;
  synopsis: string;
  trailer:string;
  studios: string;
  year: number;
  duration: string;
  genres: string;
  image?: string;
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
 *          type: number
 *        duration:
 *          type: string
 *        genres:
 *          type: string
 *        image:
 *          type: string
 */
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  synopsis: { type: String, required: true },  
  trailer: { type: String, required: true },
  studios: { type: String,required: true  }, 
  year: { type: Number, required: true }, 
  duration: { type: String,required: true },
  genres: { type: String,required: true },
  image: { type: String, default: "default.png"},
  createdAt: {type: Date, default: Date.now()}
});

export default mongoose.model<IMovie>("Movie", MovieSchema);