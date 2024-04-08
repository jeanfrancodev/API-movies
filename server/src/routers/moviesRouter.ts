import { Router } from "express";
import { check } from 'express-validator';
import MovieController from "../controllers/MovieController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Movies
 *  description: API endpoints for manging movies
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *     responses:
 *       201:
 *         description: The movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */
router.post(
  '/movies',
  [
    check('synopsis').notEmpty().withMessage('Synopsis is required'),
    check('title').notEmpty().withMessage('Title is required'),
    check('studios').notEmpty().withMessage('Studio is required'),
    check('trailer').notEmpty().withMessage('Trailer is required'),
    check('year').notEmpty().withMessage('Year is required'),
    check('duration').notEmpty().withMessage('Duration is required'),
    check('genres').notEmpty().withMessage('Genres is required'),
  ],
  MovieController.registerMovie
);
/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Movie'
 */
router.get('/movies', MovieController.getAllMovies);


/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 */
router.put(
  '/movies/:id',
  [    check('role').isIn(['ADMIN']).withMessage('Invalid role')
],
 MovieController.updateMovie);
/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film to retrive
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Movie successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 */
router.delete('/movies/:id', MovieController.deleteMovie);
// GET /api/movies - (Only logged users) Fetch a list of movie trailers with details.
// GET /api/movies/search - (Only logged users) Fetch a list of movie with pagination and sort and
// filters (sortBy realiseDate, search by realise year, name or genre).
// POST /api/movies - (Admin only) Add a new movie.
// PUT /api/movies/:id - (Admin only) Update movie details.
// DELETE /api/movies/:id - (Admin only) Delete a movie.

export default router;