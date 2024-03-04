import * as clc from 'cli-color';
import * as dotenv from 'dotenv';
import * as redis from 'ioredis';

async function redis_init() {
  const client = new redis.Redis({ host: 'localhost', port: 6379 });
  try {
    await client.connect();
  } catch (error) {
    Abort(error);
  }
}

function Abort(error: any): void {
  console.log('\n');
  console.log(clc.red(error));
  console.log(clc.red('Aborting...\n'));
  process.exit(1);
}

export async function init(production: boolean): Promise<void> {
  console.log('\nInit Started');

  console.log(
    production ? clc.green('Production Mode') : clc.yellow('Development Mode'),
  );

  dotenv.config({ debug: !production });

  console.log({ env: process.env });

  // await redis_init();

  console.log('Init Done\n');
}
