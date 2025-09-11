export type EpigramItem = {
  id: number;
  content: string;
  author: string;
  referenceTitle: string;
  referenceUrl: string;
  writerId: number;
  likeCount: number;
  tags: string[];
};

export type EpigramSearchResponse = {
  list: EpigramItem[];
  nextCursor: number | null;
  totalCount: number;
};
