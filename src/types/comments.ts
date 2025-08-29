export type Writer = {
  image?: string;
  nickname: string;
  id: number;
};

export type List = {
  epigramId: number;
  writer: Writer;
  updatedAt: string; 
  createdAt: string;
  isPrivate: boolean;
  content: string;
  id: number;
};

export type Comments = {
  totalCount: number;
  nextCursor: number;
  list: List[];
};

