import { CreateUserDto } from "@user/application/dto/create-user.dto";
import { User } from "../entities/user.entity";
import { LoginDto } from "@auth/application/dto/login.dto";

// This interface is used to create and find a user with the provided DTO, login credentials and their ID.
export interface UserCrud {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  login(loginDto: LoginDto): Promise<User | null>;
  findOneBy(id: string): Promise<User | null>;
}