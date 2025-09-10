import AuthGuard from "@/components/AuthGuard";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
