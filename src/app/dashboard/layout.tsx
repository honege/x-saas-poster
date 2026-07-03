import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch user details for subscription plan
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, subscriptionTier: true }
  });

  // Fetch accounts
  const accounts = await prisma.xAccount.findMany({
    where: { userId: userId },
    select: { id: true, handle: true }
  });

  if (!user) {
    redirect("/login");
  }

  // Next.js layout doesn't automatically know the searchParams (accountId) of the page inside children.
  // The Sidebar uses `useSearchParams` or `usePathname` inside it to determine the selected account if needed.
  // Wait, `DashboardSidebar` currently expects `selectedAccountId` as a prop.
  // It's better for the Sidebar to extract it from the URL client-side, but it's passed as prop. 
  // Let's modify the layout to pass accounts and let the sidebar figure it out, or we can use a client wrapper for the sidebar if it needs search parameters.
  // Wait, the new `DashboardSidebar` relies on props. Let's create a wrapper or just use `useSearchParams` inside it.
  // Wait, `layout.tsx` doesn't get searchParams. We can just pass `accounts` and `user`.

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <DashboardSidebar 
        user={user} 
        accounts={accounts} 
      />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#0b1120' }}>
        {children}
      </div>
    </div>
  );
}
