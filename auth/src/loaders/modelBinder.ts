import fs from 'fs/promises';
import path from 'path';
import { logger } from '../loaders/logger';

async function bindModels(): Promise<string[]> {
  try {
    let pathToModels = path.join(__dirname, '..', 'models');
    if (!pathToModels) {
      logger.error('Error with creating the model path');
      throw new Error('Database not implemented');
    }

    const files = await fs.readdir(pathToModels);
    const modelFiles = files.filter((file) => {
      const extension = path.extname(file);
      return file[0] !== '.' && (extension === '.ts' || extension === '.js');
    });

    const modelNames = [];
    for (const file of modelFiles) {
      const modelFile = require(path.join(pathToModels, file));
      modelNames.push(file);
    }

    return modelNames;
  } catch (error: any) {
    logger.error(`Unable to bind models! ${error}`);
    throw new Error(error.message);
  }
}

export default bindModels;
