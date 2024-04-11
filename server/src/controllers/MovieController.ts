import fileService from "../utils/FileService.js"
import {validationResult} from 'express-validator'
import { Request, Response } from "express"
import dotenv  from "dotenv"
import MovieModel from "../models/MovieModel.js";
import UserModel from "../models/UserModel.js";
import RateModel from "../models/RateModel.js";
import { loggers } from "winston";

dotenv.config()

class MovieController {
  async getAllMovies(req:Request,res:Response){
    try {
      const movies = await MovieModel.find().populate({
        path: 'rates',
        populate: {
          path: 'author',
          select: {
            '_id': 1,
            'name': 1,
            'avatar': 1,
          }
        }
      }).exec();
       
      return res.json(movies) 
      
    } catch (error) {
      return res.status(500).json({error:'internal Server error.'})
    }
  };
  async searchMovies(req: Request, res: Response) {
    try {
      const { search, page = 1, limit = 10 } = req.query as any;
            
      const regex = {
        $regex: search,
        $options: 'i'
      }
      
      const movies = await MovieModel
        .find({
          $or: [
            { title: regex },
            { year: regex },
            { genre: regex }
          ]
        })
        .skip((page - 1) * limit)
        .limit(limit)
        
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error.' })
    }
  }
  async registerMovie(req: Request, res: Response) {
    try {
      const { title, synopsis,trailer, studios, year, duration,genre,ageClassification } = req.body;

      const foundTitle = await MovieModel.findOne({ title })
      const foundTrailer = await MovieModel.findOne({ trailer })
      const foundSynopsis = await MovieModel.findOne({ synopsis })
  
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  
      if (foundTitle || foundTrailer || foundSynopsis)
         { return res.status(400).json({ error: 'Film already exists.' }); }
  
      let image = "default.png";
  
      if (req.files?.image) {
        image = fileService.save(req.files?.image);
      }
  
      const newMovie = new MovieModel({
        title,
        synopsis,
        trailer,
        studios,
        year,
        duration,
        genre, 
        image,
        ageClassification
      });
      
      await newMovie.save()
  
      return res.status(201).json({
        id: newMovie._id,
        title,
        synopsis,
        trailer,
        studios,
        year,
        duration,
        genre, 
        image,
        ageClassification
      });   
    } catch (error) {
      return res.status(500).json({error: 'Internal Server Error.'})      
    }
  };
  async updateMovie(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {return res.status(422).json({ errors: errors.array() }); }
      
      const { title, synopsis,trailer, studios, year, duration,genre,ageClassification } = req.body;
      const movie = await MovieModel.findById(req.params.id)

      if (!movie) { return res.status(404).json({ error: 'Movie not found.' }); }

      let image = movie.image;

      if (req.files?.image) {
        if (movie.image && movie.image !== 'default.png') {
          fileService.delete(movie.image);
        }
        image = fileService.save(req.files?.image);
      }

      movie.title= title,
      movie.synopsis= synopsis,
      movie.trailer= trailer,
      movie.studios= studios,
      movie.year= year,
      movie.duration= duration,
      movie.genre= genre
      movie.ageClassification = ageClassification

      await movie.save();

      return res.status(200).json(movie);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  async deleteMovie(req: Request, res: Response){
    try {
    const deletedMovie  = await MovieModel.findById(req.params.id)
    
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    if(deletedMovie.image && deletedMovie.image !== "default.png") {
      fileService.delete(deletedMovie.image)
    }
    await deletedMovie.deleteOne()

    return res.json("Movie deleted sucessfully"); 
    } catch (error) {
      return res.status(500).json({error:'internal Server error.'})
    }
  };
  async moviesRate(request: Request, res: Response){
    try {
      const movie = await MovieModel.findById(request.params.id)
      if (!movie) { return res.status(404).json({ error: 'Movie not found.' }); }
      
      const user = await UserModel.findById(request.user_id) 
      if (!user) { return res.status(404).json({ error: 'User not found.' }); }
      
      const { comment, stars } = request.body

      const newAvaliation = await new RateModel({
        comment,
        stars,
        author: user._id,
        movie: movie._id
      }).save();

      const filter = {
        _id: request.params.id
      }

      const update = {
        $push: { rates: newAvaliation }
      }
      await MovieModel.findOneAndUpdate(filter,update)
      
      return res.status(201).json({
        comment,
        stars,
        userId: user._id,
        movieId: movie._id,
      })
    } catch (error) {
      
      return res.status(500).json({error:'internal Server error.'})
    }
  }
}

export default new MovieController