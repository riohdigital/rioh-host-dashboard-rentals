export interface ReservationData {
  checkIn: string;
  platform: 'AIRBNB' | 'BOOKING' | 'UNKNOWN';
  value: number;
  ownerValue: number;
  status: string;
  month: string;
  property: string;
}

export interface ProcessedData {
  reservations: ReservationData[];
  totalRevenue: number;
  totalReservations: number;
  avgTicket: number;
  monthlyRevenue: { month: string; value: number }[];
  platformDistribution: { platform: string; count: number; percentage: number }[];
  recentReservations: ReservationData[];
}

// Função para converter valor string para número
function parseValue(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  return parseFloat(value.replace(/[R$\s.,]/g, '').replace(',', '.')) || 0;
}

// Função para determinar a plataforma
function determinePlatform(platformStr: string): 'AIRBNB' | 'BOOKING' | 'UNKNOWN' {
  if (!platformStr) return 'UNKNOWN';
  const str = platformStr.toUpperCase();
  if (str.includes('AIRBNB')) return 'AIRBNB';
  if (str.includes('BOOKING')) return 'BOOKING';
  return 'UNKNOWN';
}

export function processRentalData(rawData: any): ProcessedData {
  const reservations: ReservationData[] = [];
  
  // Processar dados de REC ITA (Rio Marina Resort)
  if (rawData['REC ITA']) {
    const itaData = rawData['REC ITA'];
    let currentMonth = '';
    
    for (const row of itaData) {
      // Identificar linhas de dados válidas (que têm check-in com formato de data)
      const checkInField = row['AIRBNB/BOOKING ITACURUÇA'];
      const valueField = row['MARÇO'];
      const ownerValueField = row['RIO MARINA RESORT'];
      const statusField = row['R$ 15,994.97'];
      
      // Verificar se é uma linha de cabeçalho de mês
      if (row['MARÇO'] && typeof row['MARÇO'] === 'string' && row['MARÇO'].toUpperCase().includes('ABRIL')) {
        currentMonth = 'ABRIL';
        continue;
      }
      if (row['MARÇO'] && typeof row['MARÇO'] === 'string' && row['MARÇO'].toUpperCase().includes('JUNHO')) {
        currentMonth = 'JUNHO';
        continue;
      }
      if (row['MARÇO'] && typeof row['MARÇO'] === 'string' && row['MARÇO'].toUpperCase().includes('JANEIRO')) {
        currentMonth = 'JANEIRO';
        continue;
      }
      if (!currentMonth) currentMonth = 'MARÇO';
      
      // Verificar se é uma reserva válida (tem data de check-in)
      if (checkInField && typeof checkInField === 'string' && checkInField.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const reservation: ReservationData = {
          checkIn: checkInField,
          platform: 'AIRBNB', // Assumindo Airbnb para Rio Marina
          value: parseValue(valueField),
          ownerValue: parseValue(ownerValueField),
          status: statusField || 'UNKNOWN',
          month: currentMonth,
          property: 'Rio Marina Resort'
        };
        
        if (reservation.ownerValue > 0) {
          reservations.push(reservation);
        }
      }
    }
  }
  
  // Processar dados de REC COPA (Santa Clara)
  if (rawData['REC COPA']) {
    const copaData = rawData['REC COPA'];
    let currentMonth = '';
    
    for (const row of copaData) {
      const platformField = row['Airbnb -17% / Booking -13%'];
      const checkInField = row['AIRBNB/BOOKING COPACABANA'];
      const valueField = row['MAIO'];
      const ownerValueField = row['SANTA CLARA'];
      const statusField = row['#REF!'];
      
      // Identificar linhas de cabeçalho de mês
      if (row['MAIO'] && typeof row['MAIO'] === 'string') {
        const monthStr = row['MAIO'].toUpperCase();
        if (monthStr.includes('JUNHO')) currentMonth = 'JUNHO';
        else if (monthStr.includes('JULHO')) currentMonth = 'JULHO';
        else if (monthStr.includes('AGOSTO')) currentMonth = 'AGOSTO';
        else if (monthStr.includes('OUTUBRO')) currentMonth = 'OUTUBRO';
        else if (monthStr.includes('NOVEMBRO')) currentMonth = 'NOVEMBRO';
        else if (monthStr.includes('JANEIRO')) currentMonth = 'JANEIRO';
        else if (monthStr.includes('FEVEREIRO')) currentMonth = 'FEVEREIRO';
        continue;
      }
      if (!currentMonth) currentMonth = 'MAIO';
      
      // Verificar se é uma reserva válida
      if (checkInField && typeof checkInField === 'string' && checkInField.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const reservation: ReservationData = {
          checkIn: checkInField,
          platform: determinePlatform(platformField),
          value: parseValue(valueField),
          ownerValue: parseValue(ownerValueField),
          status: statusField || 'UNKNOWN',
          month: currentMonth,
          property: 'Santa Clara'
        };
        
        if (reservation.ownerValue > 0) {
          reservations.push(reservation);
        }
      }
    }
  }
  
  // Calcular métricas
  const totalRevenue = reservations.reduce((sum, r) => sum + r.ownerValue, 0);
  const totalReservations = reservations.length;
  const avgTicket = totalReservations > 0 ? totalRevenue / totalReservations : 0;
  
  // Calcular faturamento por mês
  const monthlyRevenueMap = new Map();
  reservations.forEach(r => {
    const current = monthlyRevenueMap.get(r.month) || 0;
    monthlyRevenueMap.set(r.month, current + r.ownerValue);
  });
  
  const monthlyRevenue = Array.from(monthlyRevenueMap.entries()).map(([month, value]) => ({
    month,
    value: value as number
  }));
  
  // Calcular distribuição por plataforma
  const platformCounts = reservations.reduce((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const platformDistribution = Object.entries(platformCounts).map(([platform, count]) => ({
    platform,
    count,
    percentage: Math.round((count / totalReservations) * 100)
  }));
  
  // Reservas recentes (últimas 10, ordenadas por data)
  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(b.checkIn.split('/').reverse().join('-')).getTime() - 
    new Date(a.checkIn.split('/').reverse().join('-')).getTime()
  );
  const recentReservations = sortedReservations.slice(0, 10);
  
  return {
    reservations,
    totalRevenue,
    totalReservations,
    avgTicket,
    monthlyRevenue,
    platformDistribution,
    recentReservations
  };
}