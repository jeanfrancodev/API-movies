export interface IMovie {
  id: number;
  title: string;
  synopsis: string;
  trailer:string;
  studios: string;
  year: number;
  duration: string;
  genres: string;
  image?: string;
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