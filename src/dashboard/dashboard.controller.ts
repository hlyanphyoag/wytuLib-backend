import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DashboardDto } from './dto/dashboard.dto';

@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  @ApiResponse({
    type: DashboardDto
  })
  getDashboard() {
    return this.dashboardService.getDashboard()
  }
}
