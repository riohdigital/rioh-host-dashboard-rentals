import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReservationData } from "@/utils/dataProcessor";

interface RecentReservationsTableProps {
  data: ReservationData[];
}

export function RecentReservationsTable({ data }: RecentReservationsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const getPlatformBadgeVariant = (platform: string) => {
    switch (platform) {
      case 'AIRBNB':
        return 'destructive';
      case 'BOOKING':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground">Reservas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Check-in</TableHead>
              <TableHead>Propriedade</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Mês</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Valor Proprietário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((reservation, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatDate(reservation.checkIn)}
                </TableCell>
                <TableCell>{reservation.property}</TableCell>
                <TableCell>
                  <Badge variant={getPlatformBadgeVariant(reservation.platform)}>
                    {reservation.platform}
                  </Badge>
                </TableCell>
                <TableCell>{reservation.month}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(reservation.value)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(reservation.ownerValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}