export interface IMovie {
  id: number;
  title: string;
  synopsis: string;
  trailer:string;
  studios: string;
  year: string;
  duration: string;
  genre: Array<string>;
  image?: string;
  ageClassification:number
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface IRate {
  id: number;
  stars: number;
  comment: string;
  movie: number;
  author: number;
}