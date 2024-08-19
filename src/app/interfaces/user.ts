export interface User {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  profile: string;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
}
