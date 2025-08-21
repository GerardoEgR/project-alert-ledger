import { CreateUserDto } from "@user/application/dto/create-user.dto";
import { User } from "../entities/user.entity";
import { LoginDto } from "@auth/application/dto/login.dto";

// This interface is used to create a user with the provided DTO.
export interface UserCreator {
  createUser(createUserDto: CreateUserDto): Promise<User>;
}
// This interface is used to find a user by login credentials.
export interface UserFinder {
  login(loginDto: LoginDto): Promise<User | null>;
}
// This interface is used to find a user by their ID.
export interface UserFindOneBy {
  findOneBy(id: string): Promise<User | null>;
}