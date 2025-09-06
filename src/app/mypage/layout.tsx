import ProtectedLayout from "@/components/ProtectedLayout";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
