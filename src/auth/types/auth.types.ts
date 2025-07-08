export interface VerifiedToken {
  sub: number;
  email: string;
  type: 'access' | 'refresh';
}
