import {requireAuth} from "@/features/auth/helpers/auth-utils";

export const metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
    </div>
  );
};

export default Dashboard;
