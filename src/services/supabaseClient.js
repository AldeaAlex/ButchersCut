import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Serviciu API pentru Programări (Appointments)
 */
export async function getAppointmentsDb() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('Supabase getAppointmentsDb error:', error.message);
    return null;
  }
  return data;
}

export async function insertAppointmentDb(appointment) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        customer_name: appointment.customerName,
        customer_phone: appointment.customerPhone,
        service_id: appointment.serviceId,
        service_name: appointment.service,
        price: appointment.price,
        duration: appointment.duration,
        duration_minutes: appointment.durationMinutes,
        date: appointment.date,
        time: appointment.time,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        notes: appointment.notes || '',
        status: appointment.status || 'CONFIRMED'
      }
    ])
    .select();
  if (error) {
    console.warn('Supabase insertAppointmentDb error:', error.message);
    return null;
  }
  return data?.[0];
}

export async function updateAppointmentStatusDb(id, newStatus) {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('appointments')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) {
    console.warn('Supabase updateAppointmentStatusDb error:', error.message);
    return false;
  }
  return true;
}

export async function deleteAppointmentDb(id) {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
  if (error) {
    console.warn('Supabase deleteAppointmentDb error:', error.message);
    return false;
  }
  return true;
}

/**
 * Serviciu API pentru Servicii & Prețuri (Services)
 */
export async function getServicesDb() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    console.warn('Supabase getServicesDb error:', error.message);
    return null;
  }
  return data;
}

export async function upsertServiceDb(service) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('services')
    .upsert({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration_minutes: service.durationMinutes,
      dur: service.dur,
      is_active: service.isActive !== false
    })
    .select();
  if (error) {
    console.warn('Supabase upsertServiceDb error:', error.message);
    return null;
  }
  return data?.[0];
}

export async function deleteServiceDb(id) {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  if (error) {
    console.warn('Supabase deleteServiceDb error:', error.message);
    return false;
  }
  return true;
}

/**
 * Serviciu API pentru Program de Lucru (Working Hours)
 */
export async function getWorkingHoursDb() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('working_hours')
    .select('*')
    .order('day_of_week', { ascending: true });
  if (error) {
    console.warn('Supabase getWorkingHoursDb error:', error.message);
    return null;
  }
  return data;
}

export async function saveWorkingHoursDb(schedule) {
  if (!isSupabaseConfigured) return false;
  const payload = schedule.map((item) => ({
    day_of_week: item.dayOfWeek,
    label: item.label,
    is_working_day: item.isWorkingDay,
    start_time: item.startTime,
    end_time: item.endTime
  }));
  const { error } = await supabase
    .from('working_hours')
    .upsert(payload, { onConflict: 'day_of_week' });
  if (error) {
    console.warn('Supabase saveWorkingHoursDb error:', error.message);
    return false;
  }
  return true;
}
