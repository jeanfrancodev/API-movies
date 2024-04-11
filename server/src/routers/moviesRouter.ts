import { Router } from "express";
import { check } from 'express-validator';
import MovieController from "../controllers/MovieController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";

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
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     description: Endpoint requires authentication, access only for logged in user
 *     security:
 *       - bearerAuth: []
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
 * /api/movies/search:
 *   get:
 *     summary: Search movies specific
 *     tags: [Movies]
 *     description: Endpoint requires authentication, access only for logged in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: Filter movies for title, genre or year.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search completed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Movie'
 */
router.get('/movies/search', checkRoles(['USER','ADMIN']), MovieController.searchMovies);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     description: Create a new movie according to json file properties.
 *     security:
 *       - bearerAuth: []
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
router.post('/movies',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('synopsis').notEmpty().withMessage('Synopsis is required'),
    check('studios').notEmpty().withMessage('Studio is required'),
    check('trailer').notEmpty().withMessage('Trailer is required'),
    check('year').notEmpty().withMessage('Year is required'),
    check('duration').notEmpty().withMessage('Duration is required'),
    check('genre').notEmpty().withMessage('Genre is required'),
    check('ageClassification').notEmpty().withMessage('Age classification is required'),  
    checkRoles(['ADMIN'])
  ],
  MovieController.registerMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     description: Endpoint requires authentication, access only for user ADMIN
 *     security:
 *       - bearerAuth: []
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
router.put('/movies/:id',
//  checkRoles(['ADMIN']),
  MovieController.updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Endpoint requires authentication, access only for user ADMIN
 *     security:
 *       - bearerAuth: []
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film to deleted
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
router.delete('/movies/:id',
//  checkRoles(['ADMIN']),
  MovieController.deleteMovie);

/**
 * @swagger
 * /api/movies/{id}/rate:
 *   put:
 *     summary: Rate a movie
 *     description: Create a new rate according to movie id.
 *     security:
 *       - bearerAuth: []
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film to rate
 *         schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RateInput'
 *     responses:
 *       201:
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rate'
 */
router.put('/movies/:id/rate',
checkRoles(['USER','ADMIN']),                           
MovieController.moviesRate);


export default router;