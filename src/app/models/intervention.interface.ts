export interface Intervention {
  name: string;
  createdDate: string;
  id: string;
  order?: number;
  visibility?: 'all' | 'restricted';
  allowedUserIds?: string[];
}
