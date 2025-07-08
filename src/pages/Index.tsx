import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import Dashboard from "./Dashboard";
import Auth from "./Auth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dashboard-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
