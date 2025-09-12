import AuthGuard from "@/components/AuthGuard";

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
