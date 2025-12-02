import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Welcome endpoint',
    description: 'Returns a welcome message',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    schema: {
      example: { message: 'Welcome to Comiya Business API', version: '1.0.0' },
    },
  })
  getHello() {
    return this.appService.getWelcome();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Check if the API is running and healthy',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-10-16T19:00:00.000Z',
        uptime: 12345,
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('health/db')
  @ApiOperation({
    summary: 'Database health check',
    description: 'Check if the database connection is working',
  })
  @ApiResponse({
    status: 200,
    description: 'Database is healthy',
    schema: {
      example: {
        status: 'ok',
        database: 'connected',
        timestamp: '2025-10-16T19:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Database is not available',
    schema: {
      example: {
        status: 'error',
        database: 'disconnected',
        timestamp: '2025-10-16T19:00:00.000Z',
      },
    },
  })
  async getDatabaseHealth() {
    return this.appService.getDatabaseHealth();
  }
}
