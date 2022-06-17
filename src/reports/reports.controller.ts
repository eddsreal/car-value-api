import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../users/decorators/currentUser.decorator';
import { User } from '../users/users.entity';
import { AuthGuard } from '../guards/auth.guard';
import { ApproveReportDto, CreateReportDto, ReportDto } from './reports.dto';
import { ReportsService } from './reports.service';
import { Serialize } from '../interceptors/serialize.interceptor';

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
  approveReport(@Param('id') id: number, @Body() args: ApproveReportDto) {
    return this.reportsService.changeApproval(id, args);
  }
}
