import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  
  export class ErrorHandler {
    static handlePrismaError(error: any): never {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new BadRequestException('Duplicate entry: This record already exists.');
          case 'P2025':
            throw new NotFoundException('Record not found.');
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data format.');
      }
  
      console.error(error);
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }
  