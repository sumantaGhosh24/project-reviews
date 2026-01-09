import {requireSubscription} from "@/features/auth/helpers/auth-utils";

const Dashboard = async () => {
  await requireSubscription();

  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default Dashboard;
