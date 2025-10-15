import { supabase } from '../lib/supabase.js';

// Lot Schedule Operations
export const lotScheduleService = {
  // Get all lot schedules with related data
  async getAllLots() {
    try {
      const { data, error } = await supabase?.from('lot_schedules')?.select(`
          *,
          product:products(*),
          assigned_user:user_profiles!assigned_to(*),
          created_user:user_profiles!created_by(*)
        `)?.order('scheduled_start', { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get lot schedules within date range
  async getLotsInRange(startDate, endDate) {
    try {
      const { data, error } = await supabase?.from('lot_schedules')?.select(`
          *,
          product:products(*),
          assigned_user:user_profiles!assigned_to(*),
          resources:lot_resource_assignments(
            *,
            resource:resources(*)
          )
        `)?.gte('scheduled_start', startDate)?.lte('scheduled_end', endDate)?.order('scheduled_start');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Create new lot schedule
  async createLot(lotData) {
    try {
      const { data, error } = await supabase?.from('lot_schedules')?.insert([lotData])?.select(`
          *,
          product:products(*),
          assigned_user:user_profiles!assigned_to(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update lot schedule
  async updateLot(id, updates) {
    try {
      const { data, error } = await supabase?.from('lot_schedules')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select(`
          *,
          product:products(*),
          assigned_user:user_profiles!assigned_to(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete lot schedule
  async deleteLot(id) {
    try {
      const { error } = await supabase?.from('lot_schedules')?.delete()?.eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

// Calendar Events Operations
export const calendarService = {
  // Get all calendar events within date range
  async getEvents(startDate, endDate) {
    try {
      const { data, error } = await supabase?.from('calendar_events')?.select(`
          *,
          lot_schedule:lot_schedules(
            *,
            product:products(*)
          ),
          creator:user_profiles!created_by(*)
        `)?.gte('start_time', startDate)?.lte('end_time', endDate)?.order('start_time');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Create new calendar event
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase?.from('calendar_events')?.insert([eventData])?.select(`
          *,
          lot_schedule:lot_schedules(
            *,
            product:products(*)
          ),
          creator:user_profiles!created_by(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update calendar event
  async updateEvent(id, updates) {
    try {
      const { data, error } = await supabase?.from('calendar_events')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete calendar event
  async deleteEvent(id) {
    try {
      const { error } = await supabase?.from('calendar_events')?.delete()?.eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

// Products Operations
export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const { data, error } = await supabase?.from('products')?.select('*')?.order('product_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const { data, error } = await supabase?.from('products')?.insert([productData])?.select()?.single();

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
      const { data, error } = await supabase?.from('resources')?.select('*')?.eq('is_available', true)?.order('resource_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Check resource availability in time range
  async checkResourceAvailability(resourceId, startTime, endTime) {
    try {
      const { data, error } = await supabase?.from('lot_resource_assignments')?.select('*')?.eq('resource_id', resourceId)?.or(`assigned_from.lte.${endTime},assigned_until.gte.${startTime}`);

      if (error) throw error;
      return { 
        isAvailable: !data || data?.length === 0, 
        conflicts: data || [],
        error: null 
      };
    } catch (error) {
      return { isAvailable: false, conflicts: [], error };
    }
  },

  // Assign resource to lot
  async assignResourceToLot(lotScheduleId, resourceId, assignedFrom, assignedUntil) {
    try {
      const { data, error } = await supabase?.from('lot_resource_assignments')?.insert([{
          lot_schedule_id: lotScheduleId,
          resource_id: resourceId,
          assigned_from: assignedFrom,
          assigned_until: assignedUntil
        }])?.select(`
          *,
          resource:resources(*),
          lot_schedule:lot_schedules(*)
        `)?.single();

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
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('is_active', true)?.order('full_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get users by role
  async getUsersByRole(role) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('role', role)?.eq('is_active', true)?.order('full_name');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};

// Real-time subscriptions
export const subscriptionService = {
  // Subscribe to lot schedule changes
  subscribeLotSchedules(callback) {
    const channel = supabase?.channel('lot_schedules_changes')?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'lot_schedules' 
        },
        callback
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // Subscribe to calendar events changes
  subscribeCalendarEvents(callback) {
    const channel = supabase?.channel('calendar_events_changes')?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'calendar_events' 
        },
        callback
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};