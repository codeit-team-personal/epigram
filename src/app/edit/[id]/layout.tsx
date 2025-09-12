import AuthGuard from "@/components/AuthGuard";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
