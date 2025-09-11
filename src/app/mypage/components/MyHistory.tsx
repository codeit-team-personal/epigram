'use client';
import { User } from '@/types/user';

interface MyHistoryProps {
  user: User;
}

export default function MyHistory({ user }: MyHistoryProps) {
  if (!user) return <div>로그인이 필요합니다.</div>;
  return <div>MyHistory</div>;
}
