import AuthGuard from "@/components/AuthGuard";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
