import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { Response } from 'express';
  
  @Catch(Prisma.PrismaClientKnownRequestError)
  export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let errorResponse;
  
      switch (exception.code) {
        case 'P2002':
          errorResponse = new BadRequestException(
            'Duplicate entry: This record already exists.',
          );
          break;
        case 'P2025':
          errorResponse = new NotFoundException('Record not found.');
          break;
        default:
          errorResponse = new InternalServerErrorException('An unexpected error occurred.');
          console.error(exception);
      }
  
      response.status(errorResponse.getStatus()).json(errorResponse.getResponse());
    }
  }
  