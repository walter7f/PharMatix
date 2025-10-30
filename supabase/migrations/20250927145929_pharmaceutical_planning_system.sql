-- Ubicación: supabase/migrations/20250927145929_pharmaceutical_planning_system.sql
-- Sistema completo de planificación farmacéutica - VERSIÓN CORREGIDA SIN TRIGGER DUPLICADO

-- 1. Extensiones y Tipos Personalizados
CREATE TYPE public.user_role AS ENUM ('admin', 'production_manager', 'quality_manager', 'operator', 'auditor');
CREATE TYPE public.lot_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled', 'on_hold');
CREATE TYPE public.lot_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.resource_type AS ENUM ('equipment', 'personnel', 'material');
CREATE TYPE public.event_type AS ENUM ('lot_emission', 'maintenance', 'training', 'audit');

-- 2. Tabla Principal de Gestión de Usuarios (Compatibilidad con PostgREST)
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

-- 3. Tabla Unificada de Planificación Farmacéutica
CREATE TABLE public.planificacionFarma (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_producto TEXT NOT NULL UNIQUE,
    nombre_producto TEXT NOT NULL,
    descripcion TEXT,
    area_produccion TEXT CHECK (area_produccion IN ('solido', 'liquido', 'semisolido', 'otros')),
    numero_lote TEXT,
    numero_orden TEXT,
    distribucion TEXT CHECK (distribucion IN ('comercial', 'muestra_medica', 'comercial_1', 'institucional', 'otros')),
    lote_planificado_inicio TIMESTAMPTZ,
    lote_planificado_fin TIMESTAMPTZ,
    lote_real_inicio TIMESTAMPTZ,
    lote_real_fin TIMESTAMPTZ,
    tamano_lote DECIMAL(10,2) NOT NULL,
    cantidad_producida DECIMAL(10,2),
    tiempo_produccion_horas INTEGER NOT NULL,
    estado_general public.lot_status DEFAULT 'planned'::public.lot_status,
    prioridad public.lot_priority DEFAULT 'medium'::public.lot_priority,
    fase_preproduccion TEXT CHECK (fase_preproduccion IN ('emitido', 'aprobado', 'pesado', 'descargado', 'pendiente')),
    fase_fabricacion TEXT,
    estado_materia_prima TEXT CHECK (estado_materia_prima IN ('confirmado', 'pendiente', 'parcial', 'rechazado')),
    estado_material_empaque TEXT CHECK (estado_material_empaque IN ('confirmado', 'pendiente', 'parcial', 'rechazado')),
    desviaciones JSONB DEFAULT '[]'::JSONB,
    reprocesos JSONB DEFAULT '[]'::JSONB,
    retrabajos JSONB DEFAULT '[]'::JSONB,
    asignado_a UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    creado_por UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    notas TEXT,
    observaciones TEXT,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

-- 4. Recursos de Producción
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

-- 5. Asignaciones de Recursos para Planificación
CREATE TABLE public.asignaciones_recursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planificacion_id UUID REFERENCES public.planificacionFarma(id) ON DELETE CASCADE,
    recurso_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    asignado_desde TIMESTAMPTZ NOT NULL,
    asignado_hasta TIMESTAMPTZ NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recurso_id, asignado_desde, asignado_hasta)
);

-- 6. Eventos del Calendario (incluye mantenimiento, capacitación, auditorías)
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_type public.event_type DEFAULT 'lot_emission'::public.event_type,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    recurring_rule TEXT,
    planificacion_id UUID REFERENCES public.planificacionFarma(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_to UUID[] DEFAULT ARRAY[]::UUID[],
    location TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Índices Esenciales
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_planificacionFarma_codigo_producto ON public.planificacionFarma(codigo_producto);
CREATE INDEX idx_planificacionFarma_numero_lote ON public.planificacionFarma(numero_lote);
CREATE INDEX idx_planificacionFarma_numero_orden ON public.planificacionFarma(numero_orden);
CREATE INDEX idx_planificacionFarma_estado ON public.planificacionFarma(estado_general);
CREATE INDEX idx_planificacionFarma_fase_fabricacion ON public.planificacionFarma(fase_fabricacion);
CREATE INDEX idx_planificacionFarma_fechas ON public.planificacionFarma(lote_planificado_inicio, lote_planificado_fin);
CREATE INDEX idx_planificacionFarma_asignado_a ON public.planificacionFarma(asignado_a);
CREATE INDEX idx_resources_type ON public.resources(resource_type);
CREATE INDEX idx_asignaciones_recursos_planificacion_id ON public.asignaciones_recursos(planificacion_id);
CREATE INDEX idx_asignaciones_recursos_recurso_id ON public.asignaciones_recursos(recurso_id);
CREATE INDEX idx_calendar_events_time_range ON public.calendar_events(start_time, end_time);
CREATE INDEX idx_calendar_events_type ON public.calendar_events(event_type);
CREATE INDEX idx_calendar_events_created_by ON public.calendar_events(created_by);

-- 8. Funciones Auxiliares (ANTES de las Políticas RLS)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.actualizar_timestamp_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    NEW.version = COALESCE(OLD.version, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.can_manage_lots(user_uuid UUID)
RETURNS BOOLEAN AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = user_uuid 
    AND up.role IN ('admin', 'production_manager', 'quality_manager')
    AND up.is_active = true
)
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.validar_flujo_estados()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fase_preproduccion = 'emitido' AND OLD.fase_preproduccion IS NULL THEN
        RETURN NEW;
    END IF;
    
    IF NEW.fase_preproduccion != OLD.fase_preproduccion THEN
        CASE OLD.fase_preproduccion
            WHEN 'emitido' THEN
                IF NEW.fase_preproduccion NOT IN ('aprobado', 'pendiente') THEN
                    RAISE EXCEPTION 'Transición de fase inválida: de emitido solo se puede ir a aprobado o pendiente';
                END IF;
            WHEN 'aprobado' THEN
                IF NEW.fase_preproduccion NOT IN ('pesado', 'pendiente') THEN
                    RAISE EXCEPTION 'Transición de fase inválida: de aprobado solo se puede ir a pesado o pendiente';
                END IF;
            WHEN 'pesado' THEN
                IF NEW.fase_preproduccion NOT IN ('descargado', 'pendiente') THEN
                    RAISE EXCEPTION 'Transición de fase inválida: de pesado solo se puede ir a descargado o pendiente';
                END IF;
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generar_numero_lote()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_lote IS NULL AND NEW.codigo_producto IS NOT NULL THEN
        NEW.numero_lote := UPPER(SUBSTRING(NEW.codigo_producto FROM 1 FOR 3)) || 
                          '-' || 
                          TO_CHAR(CURRENT_DATE, 'YYMMDD') ||
                          '-' ||
                          LPAD((SELECT COALESCE(COUNT(*), 0) + 1 
                                FROM public.planificacionFarma 
                                WHERE DATE(creado_en) = CURRENT_DATE)::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Habilitar RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificacionFarma ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones_recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 10. Políticas RLS
CREATE POLICY "users_manage_own_user_profiles" ON public.user_profiles
FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "usuarios_pueden_leer_planificacionFarma" ON public.planificacionFarma
FOR SELECT TO authenticated USING (true);

CREATE POLICY "usuarios_pueden_gestionar_propia_planificacionFarma" ON public.planificacionFarma
FOR ALL TO authenticated 
USING (creado_por = auth.uid() OR asignado_a = auth.uid() OR public.can_manage_lots(auth.uid()))
WITH CHECK (creado_por = auth.uid() OR public.can_manage_lots(auth.uid()));

CREATE POLICY "authenticated_users_can_read_resources" ON public.resources
FOR SELECT TO authenticated USING (true);

CREATE POLICY "managers_can_manage_resources" ON public.resources
FOR ALL TO authenticated USING (public.can_manage_lots(auth.uid())) WITH CHECK (public.can_manage_lots(auth.uid()));

CREATE POLICY "usuarios_pueden_leer_asignaciones_recursos" ON public.asignaciones_recursos
FOR SELECT TO authenticated USING (true);

CREATE POLICY "gerentes_pueden_gestionar_asignaciones_recursos" ON public.asignaciones_recursos
FOR ALL TO authenticated USING (public.can_manage_lots(auth.uid())) WITH CHECK (public.can_manage_lots(auth.uid()));

CREATE POLICY "users_can_read_calendar_events" ON public.calendar_events
FOR SELECT TO authenticated USING (true);

CREATE POLICY "users_can_manage_own_calendar_events" ON public.calendar_events
FOR ALL TO authenticated 
USING (created_by = auth.uid() OR auth.uid() = ANY(assigned_to) OR public.can_manage_lots(auth.uid()))
WITH CHECK (created_by = auth.uid() OR public.can_manage_lots(auth.uid()));

-- 11. Triggers (SOLO los que no existen - ELIMINADO el trigger duplicado)
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER actualizar_planificacionFarma_timestamp
    BEFORE UPDATE ON public.planificacionFarma
    FOR EACH ROW EXECUTE FUNCTION public.actualizar_timestamp_actualizacion();

CREATE TRIGGER validar_estados_planificacionFarma
    BEFORE UPDATE ON public.planificacionFarma
    FOR EACH ROW EXECUTE FUNCTION public.validar_flujo_estados();

CREATE TRIGGER generar_lote_planificacionFarma
    BEFORE INSERT ON public.planificacionFarma
    FOR EACH ROW EXECUTE FUNCTION public.generar_numero_lote();

CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Datos de Prueba con Usuarios de Auth Completos
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    production_mgr_uuid UUID := gen_random_uuid();
    quality_mgr_uuid UUID := gen_random_uuid();
    operator_uuid UUID := gen_random_uuid();
    resource1_uuid UUID := gen_random_uuid();
    resource2_uuid UUID := gen_random_uuid();
    planificacion1_uuid UUID := gen_random_uuid();
    planificacion2_uuid UUID := gen_random_uuid();
    planificacion3_uuid UUID := gen_random_uuid();
BEGIN
    -- Crear usuarios de auth con campos requeridos
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

    -- Crear recursos
    INSERT INTO public.resources (id, resource_code, resource_name, resource_type, capacity, description) VALUES
        (resource1_uuid, 'LINE-01', 'Linea de Produccion 1', 'equipment', 1, 'Linea principal para tabletas'),
        (resource2_uuid, 'TEAM-A', 'Equipo de Produccion A', 'personnel', 5, 'Equipo especializado en tabletas');

    -- Crear planificaciones farmacéuticas
    INSERT INTO public.planificacionFarma (
        id, codigo_producto, nombre_producto, descripcion, area_produccion, distribucion,
        tamano_lote, tiempo_produccion_horas, fase_preproduccion, fase_fabricacion,
        estado_materia_prima, estado_material_empaque, lote_planificado_inicio, lote_planificado_fin,
        prioridad, asignado_a, creado_por, notas
    ) VALUES
        (planificacion1_uuid, 'ASPIRIN-500', 'Aspirina 500mg', 'Tabletas de aspirina 500mg para dolor y fiebre', 
         'solido', 'comercial', 10000.00, 8, 'emitido', 'Mezcla inicial',
         'confirmado', 'pendiente', 
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00',
         'high', operator_uuid, production_mgr_uuid, 'Lote prioritario para pedido urgente'),
         
        (planificacion2_uuid, 'IBUPROFEN-400', 'Ibuprofeno 400mg', 'Cápsulas de ibuprofeno 400mg antiinflamatorio', 
         'solido', 'institucional', 5000.00, 6, 'aprobado', 'Granulación',
         'confirmado', 'confirmado',
         CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00',
         'medium', operator_uuid, production_mgr_uuid, 'Produccion regular de ibuprofeno'),
         
        (planificacion3_uuid, 'JARABE-TOS', 'Jarabe para la Tos', 'Jarabe expectorante 100ml',
         'liquido', 'comercial_1', 2000.00, 4, 'pesado', 'Disolución',
         'parcial', 'pendiente',
         CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00',
         CURRENT_DATE + INTERVAL '3 days' + TIME '14:00:00',
         'low', operator_uuid, production_mgr_uuid, 'Producción de jarabe para temporada');

    -- Asignar recursos a planificaciones
    INSERT INTO public.asignaciones_recursos (planificacion_id, recurso_id, asignado_desde, asignado_hasta) VALUES
        (planificacion1_uuid, resource1_uuid, 
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00'),
        (planificacion1_uuid, resource2_uuid,
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00'),
        (planificacion2_uuid, resource1_uuid,
         CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00'),
        (planificacion3_uuid, resource1_uuid,
         CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00',
         CURRENT_DATE + INTERVAL '3 days' + TIME '14:00:00');

    -- Crear eventos del calendario
    INSERT INTO public.calendar_events (
        title, description, event_type, start_time, end_time, 
        planificacion_id, created_by, location, color
    ) VALUES
        ('Produccion Aspirina 500mg', 
         'Emision del lote - Aspirina 500mg (10,000 unidades)',
         'lot_emission',
         CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00',
         planificacion1_uuid, production_mgr_uuid, 'Planta - Linea 1', '#EF4444'),
        ('Produccion Ibuprofeno 400mg',
         'Emision del lote - Ibuprofeno 400mg (5,000 unidades)',
         'lot_emission',
         CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00',
         CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00',
         planificacion2_uuid, production_mgr_uuid, 'Planta - Linea 1', '#3B82F6'),
        ('Produccion Jarabe para la Tos',
         'Producción de jarabe expectorante 100ml (2,000 unidades)',
         'lot_emission',
         CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00',
         CURRENT_DATE + INTERVAL '3 days' + TIME '14:00:00',
         planificacion3_uuid, production_mgr_uuid, 'Planta - Area Liquidos', '#10B981'),
        ('Mantenimiento Preventivo Linea 1',
         'Mantenimiento programado de la linea de produccion 1',
         'maintenance',
         CURRENT_DATE + INTERVAL '3 days' + TIME '18:00:00',
         CURRENT_DATE + INTERVAL '3 days' + TIME '22:00:00',
         NULL, admin_uuid, 'Planta - Linea 1', '#F59E0B');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Error de clave foránea: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Error de restricción única: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inesperado: %', SQLERRM;
END $$;

-- Comentarios descriptivos para documentación
COMMENT ON TABLE public.planificacionFarma IS 'Tabla unificada para la planificación farmacéutica que combina productos y programación de lotes';
COMMENT ON COLUMN public.planificacionFarma.fase_preproduccion IS 'Fase antes de producción: emitido, aprobado, pesado, descargado';
COMMENT ON COLUMN public.planificacionFarma.fase_fabricacion IS 'Fase actual de fabricación del producto (texto libre)';
COMMENT ON COLUMN public.planificacionFarma.desviaciones IS 'Array de IDs de reportes de desviaciones en formato JSON';
COMMENT ON COLUMN public.planificacionFarma.reprocesos IS 'Array de IDs de reportes de reproceso en formato JSON';
COMMENT ON COLUMN public.planificacionFarma.retrabajos IS 'Array de IDs de reportes de retrabajo en formato JSON';