// Role-based access control for the admin PMS. Enforced server-side and used to shape the sidebar.
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'FRONT_DESK' | 'HOUSEKEEPING' | 'RESTAURANT' | 'MARKETING'

export type Permission =
  | 'view_dashboard'
  | 'view_bookings'
  | 'edit_bookings'
  | 'delete_bookings'
  | 'front_desk'
  | 'manage_rooms'
  | 'manage_restaurant'
  | 'manage_reviews'
  | 'manage_offers'
  | 'manage_gallery'
  | 'view_crm'
  | 'manage_staff'
  | 'view_reports'
  | 'manage_settings'

const ALL: Permission[] = [
  'view_dashboard', 'view_bookings', 'edit_bookings', 'delete_bookings', 'front_desk',
  'manage_rooms', 'manage_restaurant', 'manage_reviews', 'manage_offers', 'manage_gallery',
  'view_crm', 'manage_staff', 'view_reports', 'manage_settings',
]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL,
  ADMIN: ALL.filter((p) => p !== 'manage_staff'),
  FRONT_DESK: ['view_dashboard', 'view_bookings', 'edit_bookings', 'front_desk', 'view_crm'],
  HOUSEKEEPING: ['view_dashboard', 'front_desk'],
  RESTAURANT: ['view_dashboard', 'manage_restaurant'],
  MARKETING: ['view_dashboard', 'manage_offers', 'manage_gallery', 'manage_reviews', 'view_reports'],
}

export function can(role: string | undefined, permission: Permission): boolean {
  if (!role) return false
  const perms = ROLE_PERMISSIONS[role as Role]
  return perms ? perms.includes(permission) : false
}
