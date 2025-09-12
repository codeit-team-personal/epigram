// components/CommentAvatar.tsx
import Image from 'next/image';

type CommentAvatarProps = {
  nickname: string;
  image?: string;
  /** ex) "w-12 h-12" | "w-[120px] h-[120px] text-lg" */
  sizeClass?: string;
};

export function CommentAvatar({
  nickname,
  image,
  sizeClass = 'w-12 h-12', // ✅ 기본값
}: CommentAvatarProps) {
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
      width={0} // ✅ 크기는 CSS class로 제어
      height={0}
      sizes='100vw'
      className={`object-cover rounded-full ${sizeClass}`}
    />
  ) : (
    <span
      className={`flex items-center justify-center text-white font-bold  rounded-full ${sizeClass} ${getColorByName(
        nickname
      )}`}
    >
      {nickname.charAt(0).toUpperCase()}
    </span>
  );
}
