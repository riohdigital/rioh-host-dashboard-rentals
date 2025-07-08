import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Building, BarChart3, DollarSign, Receipt } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold">Dashboard de Aluguéis</h1>
              <nav className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/")}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/properties")}
                  className="flex items-center space-x-2"
                >
                  <Building className="h-4 w-4" />
                  <span>Propriedades</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/bookings")}
                  className="flex items-center space-x-2"
                >
                  <Receipt className="h-4 w-4" />
                  <span>Reservas</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/finances")}
                  className="flex items-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Finanças</span>
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}