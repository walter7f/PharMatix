-- Location: supabase/migrations/20250927145929_pharmaceutical_planning_system.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: New complete pharmaceutical planning system
-- Dependencies: Creating complete auth + planning module

-- 1. Extensions & Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'production_manager', 'quality_manager', 'operator', 'auditor');
CREATE TYPE public.lot_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled', 'on_hold');
CREATE TYPE public.lot_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.resource_type AS ENUM ('equipment', 'personnel', 'material');
CREATE TYPE public.event_type AS ENUM ('lot_emission', 'maintenance', 'training', 'audit');

-- 2. Core User Management Table (PostgREST Compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'operator'::public.user_role,
    department TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products and Formulations
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL,
    description TEXT,
    batch_size DECIMAL(10,2) NOT NULL,
    production_time_hours INTEGER NOT NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Production Resources
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_code TEXT NOT NULL UNIQUE,
    resource_name TEXT NOT NULL,
    resource_type public.resource_type NOT NULL,
    capacity INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Main Planning Calendar - Lot Emissions
CREATE TABLE public.lot_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_number TEXT NOT NULL UNIQUE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    status public.lot_status DEFAULT 'planned'::public.lot_status,
    priority public.lot_priority DEFAULT 'medium'::public.lot_priority,
    batch_quantity DECIMAL(10,2) NOT NULL,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Resource Assignments for Lots
CREATE TABLE public.lot_resource_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_schedule_id UUID REFERENCES public.lot_schedules(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    assigned_from TIMESTAMPTZ NOT NULL,
    assigned_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, assigned_from, assigned_until)
);

-- 7. Calendar Events (includes maintenance, training, audits)
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_type public.event_type DEFAULT 'lot_emission'::public.event_type,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    recurring_rule TEXT, -- RRULE for recurring events
    lot_schedule_id UUID REFERENCES public.lot_schedules(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_to UUID[] DEFAULT ARRAY[]::UUID[],
    location TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_products_product_code ON public.products(product_code);
CREATE INDEX idx_resources_type ON public.resources(resource_type);
CREATE INDEX idx_lot_schedules_product_id ON public.lot_schedules(product_id);
CREATE INDEX idx_lot_schedules_status ON public.lot_schedules(status);
CREATE INDEX idx_lot_schedules_dates ON public.lot_schedules(scheduled_start, scheduled_end);
CREATE INDEX idx_lot_schedules_assigned_to ON public.lot_schedules(assigned_to);
CREATE INDEX idx_lot_resource_assignments_lot_id ON public.lot_resource_assignments(lot_schedule_id);
CREATE INDEX idx_lot_resource_assignments_resource_id ON public.lot_resource_assignments(resource_id);
CREATE INDEX idx_calendar_events_time_range ON public.calendar_events(start_time, end_time);
CREATE INDEX idx_calendar_events_type ON public.calendar_events(event_type);
CREATE INDEX idx_calendar_events_created_by ON public.calendar_events(created_by);

-- 9. Helper Functions (BEFORE RLS Policies)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_manage_lots(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = user_uuid 
    AND up.role IN ('admin', 'production_manager', 'quality_manager')
    AND up.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'operator')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- 10. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lot_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lot_resource_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies (Using Pattern 1 & 2 from guidelines)

-- Pattern 1: Core user table - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for products
CREATE POLICY "authenticated_users_can_read_products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "managers_can_manage_products"
ON public.products
FOR ALL
TO authenticated
USING (public.can_manage_lots(auth.uid()))
WITH CHECK (public.can_manage_lots(auth.uid()));

-- Pattern 4: Public read for resources, manager write
CREATE POLICY "authenticated_users_can_read_resources"
ON public.resources
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "managers_can_manage_resources"
ON public.resources
FOR ALL
TO authenticated
USING (public.can_manage_lots(auth.uid()))
WITH CHECK (public.can_manage_lots(auth.uid()));

-- Pattern 2: Simple ownership for lot schedules
CREATE POLICY "users_can_read_lot_schedules"
ON public.lot_schedules
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "users_can_manage_own_lot_schedules"
ON public.lot_schedules
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR assigned_to = auth.uid() OR public.can_manage_lots(auth.uid()))
WITH CHECK (created_by = auth.uid() OR public.can_manage_lots(auth.uid()));

-- Resource assignments follow lot schedule permissions
CREATE POLICY "users_can_read_lot_resource_assignments"
ON public.lot_resource_assignments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "managers_can_manage_lot_resource_assignments"
ON public.lot_resource_assignments
FOR ALL
TO authenticated
USING (public.can_manage_lots(auth.uid()))
WITH CHECK (public.can_manage_lots(auth.uid()));

-- Calendar events - users can see all, manage own
CREATE POLICY "users_can_read_calendar_events"
ON public.calendar_events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "users_can_manage_own_calendar_events"
ON public.calendar_events
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR auth.uid() = ANY(assigned_to) OR public.can_manage_lots(auth.uid()))
WITH CHECK (created_by = auth.uid() OR public.can_manage_lots(auth.uid()));

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lot_schedules_updated_at
    BEFORE UPDATE ON public.lot_schedules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock Data with Complete Auth Users
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    production_mgr_uuid UUID := gen_random_uuid();
    quality_mgr_uuid UUID := gen_random_uuid();
    operator_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
    product2_uuid UUID := gen_random_uuid();
    resource1_uuid UUID := gen_random_uuid();
    resource2_uuid UUID := gen_random_uuid();
    lot1_uuid UUID := gen_random_uuid();
    lot2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@pharmatrace.com', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Maria Rodriguez", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (production_mgr_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'production@pharmatrace.com', crypt('Prod123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Carlos Mendez", "role": "production_manager"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (quality_mgr_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'quality@pharmatrace.com', crypt('Quality123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ana Silva", "role": "quality_manager"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (operator_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'operator@pharmatrace.com', crypt('Operator123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Juan Perez", "role": "operator"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create products
    INSERT INTO public.products (id, product_code, product_name, description, batch_size, production_time_hours, created_by) VALUES
        (product1_uuid, 'ASPIRIN-500', 'Aspirina 500mg', 'Tabletas de aspirina 500mg para dolor y fiebre', 10000.00, 8, production_mgr_uuid),
        (product2_uuid, 'IBUPROFEN-400', 'Ibuprofeno 400mg', 'Capsulas de ibuprofeno 400mg antiinflamatorio', 5000.00, 6, production_mgr_uuid);

    -- Create resources
    INSERT INTO public.resources (id, resource_code, resource_name, resource_type, capacity, description) VALUES
        (resource1_uuid, 'LINE-01', 'Linea de Produccion 1', 'equipment'::public.resource_type, 1, 'Linea principal para tabletas'),
        (resource2_uuid, 'TEAM-A', 'Equipo de Produccion A', 'personnel'::public.resource_type, 5, 'Equipo especializado en tabletas');

    -- Create lot schedules
    INSERT INTO public.lot_schedules (
        id, lot_number, product_id, scheduled_start, scheduled_end, 
        status, priority, batch_quantity, assigned_to, created_by, notes
    ) VALUES
        (lot1_uuid, 'LOT-ASP-001', product1_uuid, 
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00',
         'planned'::public.lot_status, 'high'::public.lot_priority, 10000.00,
         operator_uuid, production_mgr_uuid, 'Lote prioritario para pedido urgente'),
        (lot2_uuid, 'LOT-IBU-001', product2_uuid,
         CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00',
         'planned'::public.lot_status, 'medium'::public.lot_priority, 5000.00,
         operator_uuid, production_mgr_uuid, 'Produccion regular de ibuprofeno');

    -- Assign resources to lots
    INSERT INTO public.lot_resource_assignments (lot_schedule_id, resource_id, assigned_from, assigned_until) VALUES
        (lot1_uuid, resource1_uuid, 
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00'),
        (lot1_uuid, resource2_uuid,
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00'),
        (lot2_uuid, resource1_uuid,
         CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00');

    -- Create calendar events
    INSERT INTO public.calendar_events (
        title, description, event_type, start_time, end_time, 
        lot_schedule_id, created_by, location, color
    ) VALUES
        ('Produccion Aspirina 500mg - LOT-ASP-001', 
         'Emision del lote ASP-001 - Aspirina 500mg (10,000 unidades)',
         'lot_emission'::public.event_type,
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00',
         lot1_uuid, production_mgr_uuid, 'Planta - Linea 1', '#EF4444'),
        ('Produccion Ibuprofeno 400mg - LOT-IBU-001',
         'Emision del lote IBU-001 - Ibuprofeno 400mg (5,000 unidades)',
         'lot_emission'::public.event_type,
         CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00',
         lot2_uuid, production_mgr_uuid, 'Planta - Linea 1', '#3B82F6'),
        ('Mantenimiento Preventivo Linea 1',
         'Mantenimiento programado de la linea de produccion 1',
         'maintenance'::public.event_type,
         CURRENT_DATE + INTERVAL '3 days' + TIME '18:00:00',
         CURRENT_DATE + INTERVAL '3 days' + TIME '22:00:00',
         NULL, admin_uuid, 'Planta - Linea 1', '#F59E0B');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;