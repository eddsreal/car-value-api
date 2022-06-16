import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './reports.dto';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(args: CreateReportDto) {
    const report = this.repo.create(args);

    return this.repo.save(report);
  }
}
