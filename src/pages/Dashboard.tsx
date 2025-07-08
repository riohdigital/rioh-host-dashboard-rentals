import { useState, useEffect } from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MonthlyRevenueChart } from "@/components/dashboard/MonthlyRevenueChart";
import { PlatformDistributionChart } from "@/components/dashboard/PlatformDistributionChart";
import { RecentReservationsTable } from "@/components/dashboard/RecentReservationsTable";
import { processRentalData, ProcessedData } from "@/utils/dataProcessor";
import { DollarSign, Calendar, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data - substitua pelos seus dados reais
const mockRentalData = {
  "REC ITA": [
    {
      "AIRBNB/BOOKING ITACURUÇA": "CHECK-IN",
      "MARÇO": "VALOR RECEBIDO / PREVISTO",
      "RIO MARINA RESORT": "TOTAL PROPRIETÁRIO",
      "VALOR BRUTO ANUAL": "ESTATUS PAGAMENTO",
      "R$ 15,994.97": "ESTATUS RESERVA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "01/03/2025",
      "MARÇO": "R$ 2,306.47",
      "RIO MARINA RESORT": "R$ 1,645.18",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "10/03/2025",
      "MARÇO": "R$ 1,695.93",
      "RIO MARINA RESORT": "R$ 1,156.74",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "17/03/2025",
      "MARÇO": "R$ 753.96",
      "RIO MARINA RESORT": "R$ 403.17",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "21/03/2025",
      "MARÇO": "R$ 726.83",
      "RIO MARINA RESORT": "R$ 381.46",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "30/03/2025",
      "MARÇO": "R$ 1,870.37",
      "RIO MARINA RESORT": "R$ 1,296.30",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "MARÇO": "R$ 7,353.56",
      "RIO MARINA RESORT": "R$ 4,882.85"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "R$ 7,353.56",
      "MARÇO": "R$ 0.00",
      "R$ 15,994.97": "R$ 0.00"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "AIRBNB/BOOKING ITACURUÇA",
      "MARÇO": "ABRIL",
      "RIO MARINA RESORT": "RIO MARINA RESORT",
      "VALOR BRUTO ANUAL": "VALOR  BRUTO ANUAL",
      "R$ 15,994.97": "R$ 15,994.97"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "CHECK-IN",
      "MARÇO": "VALOR RECEBIDO / PREVISTO",
      "RIO MARINA RESORT": "TOTAL PROPRIETÁRIO",
      "VALOR BRUTO ANUAL": "ESTATUS PAGAMENTO",
      "R$ 15,994.97": "ESTATUS RESERVA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "13/04/2025",
      "MARÇO": "R$ 2,829.81",
      "RIO MARINA RESORT": "R$ 2,063.85",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "20/04/2025",
      "MARÇO": "R$ 1,162.73",
      "RIO MARINA RESORT": "R$ 730.18",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "24/04/2025",
      "MARÇO": "R$ 2,700.58",
      "RIO MARINA RESORT": "R$ 1,960.46",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    },
    {
      "MARÇO": "R$ 6,693.12",
      "RIO MARINA RESORT": "R$ 4,754.50"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "R$ 6,693.12",
      "MARÇO": "R$ 0.00",
      "R$ 15,994.97": "R$ 0.00"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "AIRBNB/BOOKING ITACURUÇA",
      "MARÇO": "JUNHO",
      "RIO MARINA RESORT": "RIO MARINA RESORT",
      "VALOR BRUTO ANUAL": "VALOR  BRUTO ANUAL",
      "R$ 15,994.97": "R$ 15,994.97"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "CHECK-IN",
      "MARÇO": "VALOR RECEBIDO / PREVISTO",
      "RIO MARINA RESORT": "TOTAL PROPRIETÁRIO",
      "VALOR BRUTO ANUAL": "ESTATUS PAGAMENTO",
      "R$ 15,994.97": "ESTATUS RESERVA"
    },
    {
      "AIRBNB/BOOKING ITACURUÇA": "30/06/2025",
      "MARÇO": "R$ 1,948.29",
      "RIO MARINA RESORT": "R$ 1,318.63",
      "VALOR BRUTO ANUAL": "PAGO",
      "R$ 15,994.97": "FINALIZADA"
    }
  ],
  "REC COPA": [
    {
      "Airbnb -17% / Booking -13%": "PLATAFORMA",
      "AIRBNB/BOOKING COPACABANA": "CHECK-IN",
      "MAIO": "VALOR RECEBIDO / PREVISTO",
      "SANTA CLARA": "TOTAL PROPRIETÁRIO",
      "VALOR BRUTO ANUAL": "ESTATUS PAGAMENTO",
      "#REF!": "ESTATUS RESERVA"
    },
    {
      "Airbnb -17% / Booking -13%": "AIRBNB",
      "AIRBNB/BOOKING COPACABANA": "01/05/2025",
      "MAIO": "R$ 2,529.23",
      "SANTA CLARA": "R$ 1,863.38",
      "VALOR BRUTO ANUAL": "PAGO",
      "#REF!": "FINALIZADA"
    },
    {
      "Airbnb -17% / Booking -13%": "BOOKING",
      "AIRBNB/BOOKING COPACABANA": "21/05/2025",
      "MAIO": "R$ 1,526.68",
      "SANTA CLARA": "R$ 1,021.34",
      "VALOR BRUTO ANUAL": "PAGO",
      "#REF!": "FINALIZADA"
    },
    {
      "Airbnb -17% / Booking -13%": "AIRBNB",
      "AIRBNB/BOOKING COPACABANA": "19/06/2025",
      "MAIO": "R$ 1,508.66",
      "SANTA CLARA": "R$ 1,006.93",
      "VALOR BRUTO ANUAL": "PAGO",
      "#REF!": "FINALIZADA"
    },
    {
      "Airbnb -17% / Booking -13%": "AIRBNB",
      "AIRBNB/BOOKING COPACABANA": "09/07/2025",
      "MAIO": "R$ 892.57",
      "SANTA CLARA": "R$ 514.06",
      "VALOR BRUTO ANUAL": "PREVISTA",
      "#REF!": "CONFIRMADA"
    },
    {
      "AIRBNB/BOOKING COPACABANA": "17/07/2025",
      "MAIO": "R$ 2,173.20",
      "SANTA CLARA": "R$ 1,538.56",
      "VALOR BRUTO ANUAL": "PREVISTA",
      "#REF!": "CONFIRMADA"
    },
    {
      "Airbnb -17% / Booking -13%": "AIRBNB",
      "AIRBNB/BOOKING COPACABANA": "13/08/2025",
      "MAIO": "R$ 1,014.14",
      "SANTA CLARA": "R$ 611.31",
      "VALOR BRUTO ANUAL": "PREVISTA",
      "#REF!": "CONFIRMADA"
    },
    {
      "Airbnb -17% / Booking -13%": "AIRBNB",
      "AIRBNB/BOOKING COPACABANA": "16/10/2025",
      "MAIO": "R$ 4,050.31",
      "SANTA CLARA": "R$ 3,040.25",
      "VALOR BRUTO ANUAL": "PREVISTA",
      "#REF!": "CONFIRMADA"
    },
    {
      "Airbnb -17% / Booking -13%": "BOOKING",
      "AIRBNB/BOOKING COPACABANA": "14/11/2025",
      "MAIO": "R$ 2,589.56",
      "SANTA CLARA": "R$ 1,871.65",
      "VALOR BRUTO ANUAL": "PREVISTA",
      "#REF!": "PREVISTA"
    }
  ]
};

export default function Dashboard() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    const data = processRentalData(mockRentalData);
    setProcessedData(data);
  }, []);

  if (!processedData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Dashboard de Aluguéis - Rio Marina Resort & Santa Clara
          </h1>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dashboard-blue mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard de Aluguéis - Rio Marina Resort & Santa Clara
          </h1>
          <p className="text-muted-foreground">
            Acompanhe as métricas e performance dos seus imóveis de temporada
          </p>
        </div>

        {/* Alertas sobre dados indisponíveis */}
        <div className="space-y-2">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Dados Indisponíveis:</strong> As métricas "Total de Diárias Vendidas" e "Clientes Únicos" 
              não puderam ser calculadas pois os campos necessários não estão presentes na estrutura de dados fornecida.
            </AlertDescription>
          </Alert>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Faturamento Total"
            value={formatCurrency(processedData.totalRevenue)}
            icon={DollarSign}
            color="blue"
          />
          <KpiCard
            title="Total de Reservas"
            value={processedData.totalReservations.toString()}
            icon={Calendar}
            color="green"
          />
          <KpiCard
            title="Ticket Médio por Reserva"
            value={formatCurrency(processedData.avgTicket)}
            icon={TrendingUp}
            color="gray"
          />
          <KpiCard
            title="Propriedades Ativas"
            value="2"
            icon={Users}
            color="red"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyRevenueChart data={processedData.monthlyRevenue} />
          <PlatformDistributionChart data={processedData.platformDistribution} />
        </div>

        {/* Recent Reservations Table */}
        <RecentReservationsTable data={processedData.recentReservations} />
      </div>
    </div>
  );
}