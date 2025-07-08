-- Criar tabela de propriedades
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de reservas
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'AIRBNB' ou 'BOOKING'
  checkin_date DATE NOT NULL,
  checkout_date DATE,
  guest_name TEXT,
  status TEXT NOT NULL DEFAULT 'CONFIRMADA', -- 'CONFIRMADA', 'FINALIZADA', 'CANCELADA'
  payment_status TEXT NOT NULL DEFAULT 'PENDENTE', -- 'PAGO', 'PENDENTE', 'PREVISTA'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de receitas
CREATE TABLE public.revenues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gross_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL, -- valor para o proprietário
  platform_fee DECIMAL(10,2),
  received_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de despesas
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'FIXO' ou 'VARIAVEL'
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para properties
CREATE POLICY "Users can view their own properties" 
ON public.properties FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
ON public.properties FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
ON public.properties FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
ON public.properties FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings" 
ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para revenues
CREATE POLICY "Users can view their own revenues" 
ON public.revenues FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own revenues" 
ON public.revenues FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own revenues" 
ON public.revenues FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own revenues" 
ON public.revenues FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas RLS para expenses
CREATE POLICY "Users can view their own expenses" 
ON public.expenses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" 
ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
ON public.expenses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" 
ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para atualização automática de timestamps
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_revenues_updated_at
  BEFORE UPDATE ON public.revenues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();