import AuthGuard from "@/components/AuthGuard";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
