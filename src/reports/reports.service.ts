import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApproveReportDto,
  CreateReportDto,
  GetEstimateDto,
} from './reports.dto';
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

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(prive)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE', { model })
      .orderBy('ABS(mile - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();
  }
}
