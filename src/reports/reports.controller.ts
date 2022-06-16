import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  createReport(@Body() args: CreateReportDto) {
    return this.reportsService.create(args);
  }
}
