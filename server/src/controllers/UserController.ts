import { validationResult } from "express-validator";
import { IUser } from "../interfaces/interfaces.js";
import fileService from "../utils/FileService.js";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from "../models/UserModel.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  };

  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const foundUser = await UserModel.findOne({ email })

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      if (foundUser) { return res.status(400).json({ error: 'User already exists.' }); }

      let avatar = "default-avatar.png";

      if (req.files?.avatar) {
        avatar = fileService.save(req.files?.avatar);
      }

      const newUser = new UserModel({
        name,
        email,
        password: bcrypt.hashSync(password.trim(), 7),
        avatar,
        role
      });

      await newUser.save();

      const payload = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }

      const token = jwt.sign(payload, String(SECRET_KEY));

      newUser.password = "";

      return res.status(201).json({ user: newUser, accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  async loginUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const foundUser = await UserModel.findOne({ email });
      console.log(foundUser);
      
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        return res.status(400).json({ error: 'Invalid password.' });
      }

      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      }

      foundUser.password = "";

      const token = jwt.sign(payload, String(SECRET_KEY));

      return res.json({ user: foundUser, accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  async updateUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { return res.status(422).json({ errors: errors.array() }); }

      const { name, email, password, role } = req.body;
      const user = await UserModel.findById(req.params.id)
        
      if (!user) { return res.status(404).json({ error: 'User not found.' }); }

      let avatar = user.avatar;

      if (req.files?.avatar) {
        if (user.avatar && user.avatar !== 'default-avatar.png') {
          fileService.delete(user.avatar);
        }
        avatar = fileService.save(req.files?.avatar);
      }

      user.name = name;
      user.email = email;
      user.password = bcrypt.hashSync(password.trim(), 7);
      user.avatar = avatar;
      user.role = role;
      console.log(user.name);
      
      await user.save();

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const deletedUser: any = await UserModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (deletedUser.avatar !== "default.png") {
        fileService.delete(deletedUser.avatar);
      }

      await deletedUser.deleteOne()
      return res.json({ message: "User deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  };

  async searchUsers(req: Request, res: Response) {
    try {
      const { query, page = 1, limit = 10 } = req.query as any;

      const regex = new RegExp(query, 'i')

      const users = await UserModel
        .find({
          $or: [
            { name: regex },
            { email: regex },
            { role: regex }
          ]
        })
        .skip((page - 1) * limit)
        .limit(limit)

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
}

export default new UserController;