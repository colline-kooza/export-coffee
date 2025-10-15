import DashboardUserListing from "./components/DashboardUserListing";

export default function UsersPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 container max-w-5xl mx-auto">
      <DashboardUserListing title="Users" subtitle="Manage your users " />
    </div>
  );
}
