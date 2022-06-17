import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../users/decorators/currentUser.decorator';
import { User } from '../users/users.entity';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApproveReportDto,
  CreateReportDto,
  GetEstimateDto,
  ReportDto,
} from './reports.dto';
import { ReportsService } from './reports.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() args: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create({ ...args, user });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: number, @Body() args: ApproveReportDto) {
    return this.reportsService.changeApproval(id, args);
  }

  @Get('/')
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
