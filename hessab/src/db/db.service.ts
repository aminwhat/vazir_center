import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model } from 'mongoose';
import {
  Log,
  Client,
  Project,
  CommingSoon,
  Info,
  User,
} from 'src/common/schemas';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    const log = await this.logModel.findOne().exec();
    if (!log) {
      const log = new this.logModel({
        message: 'Database Created: hessab',
      });
      await log.save();
    }

    const client = await this.clientModel.findOne().exec();

    if (!client) {
      const createdClient = new this.clientModel({
        name: '0.0.1',
        version: '0.0.1',
        version_index: 0,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImFwcCI6InZhemlyIn0.eyJ2ZXJzaW9uIjoiMC4wLjAiLCJuYW1lIjoiaW5pdGlhbCIsImNvZGUiOjEyMzQ1Njc4OX0.FOakdKhTPYwrZDGpV9Yb337oU-qjWJRfaQxcOuuDmug',
        download_uri:
          'https://github.com/aminwhat/vazir_hessab/releases/download/0.0.1/Vazir.Hessab.exe',
        options: {
          access: 'حافظه داخلی, اینترنت',
          date_release: 'Nov 6, 2023',
          file_size: '12.7 MB',
          os: 'Windows 10 & 11',
          release_log_uri:
            'https://github.com/aminwhat/vazir_hessab/releases/tag/0.0.1',
        },
      });
      await createdClient.save();
    }

    // if (!this.configService.get<boolean>('PRODUCTION')) {
    //   if (client) {
    //     const nextVersionExists = await this.clientModel
    //       .findOne({ version_index: 1 })
    //       .exec();

    //     if (!nextVersionExists) {
    //       const nextVersionClient = new this.clientModel({
    //         name: 'after initial',
    //         version: '0.0.1',
    //         version_index: 1,
    //         token:
    //           'alskdjaskldajdklasjdaksljbjbkb43kjwbrjkwebk12uh9*(!Husd8faasdsabdkadakdjbas',
    //         download_uri:
    //           'https://github.com/aminwhat/hessab-download/releases/download/Financial-Platform-Init/Vazir.Hessab.exe',
    //       });

    //       // await this.clientModel
    //       //   .updateOne({}, { $set: { nextVersion_id: nextVersionClient._id } })
    //       //   .exec();
    //       await nextVersionClient.save();
    //     }
    //   }
    // }

    const info = await this.infoModel.findOne().exec();
    if (!info) {
      const projectsScreenInfo = new this.infoModel({
        key: 'dashboard_screen',
        uri: 'https://vazir.io/docs',
      });

      await projectsScreenInfo.save();
    }
  }

  constructor(
    @InjectConnection('hessab') private connection: Connection,
    @InjectConnection('hessab') private userModel: Model<User>,
    @InjectModel(Client.name, 'hessab') private clientModel: Model<Client>,
    @InjectModel(Log.name, 'hessab') private logModel: Model<Log>,
    @InjectModel(Project.name, 'hessab') private projectModel: Model<Project>,
    @InjectModel(CommingSoon.name, 'hessab')
    private commingSoonModel: Model<CommingSoon>,
    @InjectModel(Info.name, 'hessab') private infoModel: Model<Info>,
    private configService: ConfigService,
  ) {}

  async versionExists(
    version: string,
    token: string,
  ): Promise<{
    versionExists: boolean;
    nextVersion?: Client;
  }> {
    const client = await this.clientModel
      .findOne({ version: version, token: token })
      .exec();
    if (!client) {
      return {
        versionExists: false,
      };
    } else if (client) {
      const nextVersion = await this.clientModel
        .find()
        .sort({ version_index: -1 })
        .limit(1)
        .exec();
      if (nextVersion[0].token != client.token) {
        return { versionExists: true, nextVersion: nextVersion[0] };
      } else {
        return {
          versionExists: true,
        };
      }
    } else {
      return {
        versionExists: false,
      };
    }
  }

  async createCommingSoon({
    phoneNumber,
    ip,
    request_ip,
  }: {
    phoneNumber: string;
    ip: string;
    request_ip: string;
  }) {
    const comming_soon = new this.commingSoonModel({
      ip: ip,
      phoneNumber: phoneNumber,
      request_ip: request_ip,
    });
    await comming_soon.save();
  }

  async getInfo(key: string): Promise<string> {
    const info = await this.infoModel.findOne({ key: key }).exec();
    return info.uri;
  }

  async getRelease(): Promise<Client> {
    const clients = await this.clientModel
      .find()
      .sort({ version_index: -1 })
      .limit(1)
      .exec();

    console.log('getRelease');

    return clients[0];
  }

  async getUser(
    user: FilterQuery<User>,
    items?: string[],
  ): Promise<{ succeed: boolean; data?: User }> {
    try {
      const theUser = await this.userModel.findOne(user, items).exec();
      return { succeed: true, data: theUser };
    } catch (error) {
      return { succeed: false };
    }
  }
}
