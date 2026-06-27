import { ReactNode } from "react";
import Footer from "@/components/layout/footer";

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
      <Footer />
    </div>
  );
}