// 프로필 이미지 또는 닉네임 기반 색상 아바타
import Image from 'next/image';

export function CommentAvatar({
  nickname,
  image,
}: {
  nickname: string;
  image?: string;
}) {
  // 기본 색상 팔레트
  const colors = [
    'bg-[var(--color-illustration-yellow)]',
    'bg-[var(--color-illustration-green)]',
    'bg-[var(--color-illustration-purple)]',
    'bg-[var(--color-illustration-sky)]',
    'bg-[var(--color-illustration-pink)]',
    'bg-[var(--color-illustration-brown)]',
    'bg-[var(--color-illustration-orange)]',
    'bg-[var(--color-illustration-dark)]',
    'bg-[var(--color-illustration-navy)]',
    'bg-[var(--color-illustration-slate)]',
  ];

  // 문자열 해시 → 색상 인덱스
  function getColorByName(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  return image ? (
    <Image
      src={image}
      alt={`${nickname} 프로필`}
      width={48}
      height={48}
      className='object-cover w-full h-full rounded-full'
    />
  ) : (
    <span
      className={`w-12 h-12 flex items-center justify-center text-white font-bold text-lg rounded-full ${getColorByName(
        nickname
      )}`}
    >
      {nickname.charAt(0).toUpperCase()}
    </span>
  );
}
