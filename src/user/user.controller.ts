import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  // Authguard jwt ve de jwt strategy
  @UseGuards(JwtGuard) // recordar que Authorization va en el header al enviar el request
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
