export type Tag = {
  id: number;
  name: string;
};

export type Epigram = {
  likeCount: number;
  id: number;
  content: string;
  author: string;
  referenceTitle?: string;
  referenceUrl?: string;
  writerId?: number;
  tags?: Tag[];
  isLiked: boolean;
};

export type EpigramResponse = {
  totalCount: number;
  nextCursor: number;
  list: Epigram[];
};
