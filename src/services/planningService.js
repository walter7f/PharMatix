import { supabase } from '../lib/supabase.js';

// Planificación Farma Operations (Reemplaza lot_schedules)
export const lotScheduleService = {
  // Get all planificaciones with related data
  async getAllLots() {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .select(`
          *,
          asignado_a:user_profiles!asignado_a(*),
          creado_por:user_profiles!creado_por(*)
        `)
        .order('creado_en', { ascending:   false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get planificaciones within date range
  async getLotsInRange(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .select(`
          *,
          asignado_a:user_profiles!asignado_a(*),
          creado_por:user_profiles!creado_por(*),
          recursos:asignaciones_recursos(
            *,
            recurso:resources(*)
          )
        `)
        .gte('lote_planificado_inicio', startDate)
        .lte('lote_planificado_fin', endDate)
        .order('lote_planificado_inicio');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Create new planificación
  async createLot(lotData) {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .insert([lotData])
        .select(`
          *,
          asignado_a:user_profiles!asignado_a(*),
          creado_por:user_profiles!creado_por(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update planificación
  async updateLot(id, updates) {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .update({ 
          ...updates, 
          actualizado_en: new Date().toISOString() 
        })
        .eq('id', id)
        .select(`
          *,
          asignado_a:user_profiles!asignado_a(*),
          creado_por:user_profiles!creado_por(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete planificación
  async deleteLot(id) {
    try {
      const { error } = await supabase
        .from('planificacionfarma')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

// Calendar Events Operations (Actualizado para nueva estructura)
export const calendarService = {
  // Get all calendar events within date range
  async getEvents(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          planificacion:planificacionfarma(
            *,
            asignado_a:user_profiles!asignado_a(*)
          ),
          creator:user_profiles!created_by(*)
        `)
        .gte('start_time', startDate)
        .lte('end_time', endDate)
        .order('start_time');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Create new calendar event
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([eventData])
        .select(`
          *,
          planificacion:planificacionfarma(
            *,
            asignado_a:user_profiles!asignado_a(*)
          ),
          creator:user_profiles!created_by(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update calendar event
  async updateEvent(id, updates) {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete calendar event
  async deleteEvent(id) {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

// Products Operations
export const productService = {
  // Get all products from planificacionfarma (códigos únicos)
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .select('codigo_producto, nombre_producto, descripcion, area_produccion')
        .order('nombre_producto');

      if (error) throw error;
      
      const products = data.map(item => ({
        id: item.codigo_producto,
        product_code: item.codigo_producto,
        product_name: item.nombre_producto,
        description: item.descripcion,
        area_produccion: item.area_produccion
      }));

      return { data: products || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Create new product (ahora se crea como planificación)
  async createProduct(productData) {
    try {
      const planificacionData = {
        codigo_producto: productData.product_code,
        nombre_producto: productData.product_name,
        descripcion: productData.description,
        area_produccion: productData.area_produccion,
        tamano_lote: productData.batch_size || 0,
        tiempo_produccion_horas: productData.production_time_hours || 0,
        estado_general: 'planned'
      };

      const { data, error } = await supabase
        .from('planificacionfarma')
        .insert([planificacionData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Resources Operations
export const resourceService = {
  // Get all available resources
  async getAvailableResources() {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_available', true)
        .order('resource_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Check resource availability in time range
  async checkResourceAvailability(resourceId, startTime, endTime) {
    try {
      const { data, error } = await supabase
        .from('asignaciones_recursos')
        .select('*')
        .eq('recurso_id', resourceId)
        .or(`asignado_desde.lte.${endTime},asignado_hasta.gte.${startTime}`);

      if (error) throw error;
      return { 
        isAvailable: !data || data.length === 0, 
        conflicts: data || [],
        error: null 
      };
    } catch (error) {
      return { isAvailable: false, conflicts: [], error };
    }
  },

  // Assign resource to planificación
  async assignResourceToLot(planificacionId, resourceId, assignedFrom, assignedUntil) {
    try {
      const { data, error } = await supabase
        .from('asignaciones_recursos')
        .insert([{
          planificacion_id: planificacionId,
          recurso_id: resourceId,
          asignado_desde: assignedFrom,
          asignado_hasta: assignedUntil
        }])
        .select(`
          *,
          recurso:resources(*),
          planificacion:planificacionfarma(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// User Operations
export const userService = {
  // Get all users
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get users by role
  async getUsersByRole(role) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};

// Real-time subscriptions
export const subscriptionService = {
  // Subscribe to planificacion changes
  subscribeLotSchedules(callback) {
    const channel = supabase
      .channel('planificacion_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'planificacionfarma'
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  // Subscribe to calendar events changes
  subscribeCalendarEvents(callback) {
    const channel = supabase
      .channel('calendar_events_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'calendar_events' 
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
};

// Servicio adicional para la nueva funcionalidad
export const planificacionService = {
  // Obtener todas las áreas de producción únicas
  async getAreasProduccion() {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .select('area_produccion')
        .not('area_produccion', 'is', null);

      if (error) throw error;
      
      const areasUnicas = [...new Set(data.map(item => item.area_produccion))];
      return { data: areasUnicas, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Obtener todas las fases de fabricación únicas
  async getFasesFabricacion() {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .select('fase_fabricacion')
        .not('fase_fabricacion', 'is', null);

      if (error) throw error;
      
      const fasesUnicas = [...new Set(data.map(item => item.fase_fabricacion))];
      return { data: fasesUnicas, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Obtener todas las distribuciones únicas
  async getDistribuciones() {
    try {
      const { data, error } = await supabase
        .from('planificacionfarma')
        .select('distribucion')
        .not('distribucion', 'is', null);

      if (error) throw error;
      
      const distribucionesUnicas = [...new Set(data.map(item => item.distribucion))];
      return { data: distribucionesUnicas, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};