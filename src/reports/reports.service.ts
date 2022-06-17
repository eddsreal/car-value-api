import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApproveReportDto, CreateReportDto } from './reports.dto';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(args: CreateReportDto) {
    const report = this.repo.create(args);

    return this.repo.save(report);
  }

  async changeApproval(id: number, args: ApproveReportDto) {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = args.approved;

    return this.repo.save(report);
  }
}
