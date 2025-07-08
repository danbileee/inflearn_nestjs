import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_DIRECTORY = 'public';
export const TEMP_DIRECTORY = 'temp';
export const IMAGES_DIRECTORY = 'images';

export const PUBLIC_PATH = join(PROJECT_ROOT_PATH, PUBLIC_DIRECTORY);
export const TEMP_PATH = join(PUBLIC_PATH, TEMP_DIRECTORY);
export const IMAGES_PATH = join(PUBLIC_PATH, IMAGES_DIRECTORY);

/**
 * IMAGES
 */
export const ABSOLUTE_IMAGES_PATH = join(
  PROJECT_ROOT_PATH,
  PUBLIC_DIRECTORY,
  IMAGES_DIRECTORY,
);
export const RELATIVE_IMAGES_PATH = join(PUBLIC_DIRECTORY, IMAGES_DIRECTORY);
