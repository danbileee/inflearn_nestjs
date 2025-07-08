export const ImageTypes = {
  Post: 'Post',
  PostComment: 'PostComment',
} as const;

export type ImageType = keyof typeof ImageTypes;
