export const RelationshipIncludeTypes = {
  All: 'All',
  OnlyConfirmed: 'OnlyConfirmed',
} as const;

export type RelationshipIncludeType = keyof typeof RelationshipIncludeTypes;
