import { BadRequestException, Injectable, InternalServerErrorException, Delete } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@auth/application/dto/login.dto';
import { UserCrud } from '@user/domain/interfaces/user-crud.interface';

/**
 * This service handles user-related operations such as creating a user, logging in, and removing a user.
 * It uses TypeORM to interact with the database and bcrypt for password hashing.
 * @implements {UserCreator} - It implements the UserCreator UserFinder, UserFindOneBy interfaces to 
 * provide the necessary methods for creating and searching users.
 */
@Injectable()
export class UserService implements UserCrud {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject the User repository to interact with the database
  ) { }

  /**
   * This method creates a new user in the database implementing the UserCreator interface.
   * It hash the password before saving it to ensure security.
   * It throws an error if the user already exists or if there is a database error.
   * @param createUserDto - The data transfer object containing user details.
   * @returns user object
   **/
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10) // Hash the password before saving
      });

      await this.userRepository.save(user);
      return user;

    } catch (error) {
      this.handleDbError(error);
    }
  }

  /**
  * This method, implemented by the UserCreator interface, logs the user in by checking the provided email and password.
  * It returns the user object if the credentials are valid.
  * If the credentials are invalid, it throws a BadRequestException.
  * @param loginDto - The login data transfer object containing the email and password.
  * @returns user object
  **/
  async login(loginDto: LoginDto): Promise<User | null> {

    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Invalid credentials');

    return user;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  findOneBy(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * This method handles database errors and throws appropriate exceptions.
   * It checks for specific error codes and throws a BadRequestException if the user already exists.
   * For other errors, it throws an InternalServerErrorException.
   * @param error - The error object from the database operation.
   **/
  private handleDbError(error: any): never {

    if (error.code === '23505')
      throw new BadRequestException('User already exists');

    console.log(error)

    throw new InternalServerErrorException('An error occurred while processing the request. Please try again later.');
  }
}