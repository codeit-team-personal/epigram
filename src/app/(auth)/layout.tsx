import LoggedInLayout from "@/components/LoggedInLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LoggedInLayout>{children}</LoggedInLayout>
    </>
  );
}
