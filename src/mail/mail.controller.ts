import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  @Get()
  @Public()
  @ResponseMessage('send email')
  async handleSendEmail() {
    const jobs = [];
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingskills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      if (jobWithMatchingskills?.length > 0) {
        jobWithMatchingskills.map((item) => {
          jobs.push({
            name: item.name,
            company: item.company.name,
            salary: item.salary,
            skills: item.skills,
          });
        });
      }
    }

    await this.mailerService.sendMail({
      to: 'huuddq@gmail.com',
      from: '"Support Team" <support@example.com>',
      subject: 'tesst',
      template: 'job',
      context: {
        jobs: jobs,
      },
    });
  }
}
