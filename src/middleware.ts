import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/accounts/:path*",
    "/pricing", // (Optional) Protect pricing or let guests view it
  ],
};
