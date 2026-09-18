import type { CloudService, CostItem, Region, SecurityCheck } from '../types/cloud'

export const services: CloudService[] = [
  {
    id: 'ec2',
    name: 'Amazon EC2',
    shortName: 'EC2',
    category: 'Compute',
    description: 'Servidores virtuales escalables para ejecutar aplicaciones.',
    purpose: 'Capa de aplicación y procesamiento',
    status: 'En uso',
    icon: 'dns',
    iconTone: 'info',
  },
  {
    id: 's3',
    name: 'Amazon S3',
    shortName: 'S3',
    category: 'Storage',
    description: 'Almacenamiento de objetos con alta durabilidad.',
    purpose: 'Archivos, respaldos y contenido estático',
    status: 'En uso',
    icon: 'database',
    iconTone: 'success',
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    shortName: 'RDS',
    category: 'Database',
    description: 'Base de datos relacional administrada y segura.',
    purpose: 'Persistencia de datos transaccionales',
    status: 'En uso',
    icon: 'storage',
    iconTone: 'warning',
  },
  {
    id: 'iam',
    name: 'AWS IAM',
    shortName: 'IAM',
    category: 'Security',
    description: 'Control de identidades, roles y permisos de acceso.',
    purpose: 'Gobierno de acceso y cuentas',
    status: 'En uso',
    icon: 'admin_panel_settings',
    iconTone: 'success',
  },
  {
    id: 'vpc',
    name: 'Amazon VPC',
    shortName: 'VPC',
    category: 'Networking',
    description: 'Red virtual aislada para controlar el tráfico Cloud.',
    purpose: 'Segmentación y conectividad privada',
    status: 'En uso',
    icon: 'hub',
    iconTone: 'info',
  },
  {
    id: 'route53',
    name: 'Amazon Route 53',
    shortName: 'Route 53',
    category: 'Networking',
    description: 'Servicio DNS administrado con alta disponibilidad.',
    purpose: 'Resolución de dominios y routing',
    status: 'Disponible',
    icon: 'language',
    iconTone: 'neutral',
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    shortName: 'CloudFront',
    category: 'Delivery',
    description: 'Red de distribución de contenido de baja latencia.',
    purpose: 'Entrega global de contenido',
    status: 'En uso',
    icon: 'public',
    iconTone: 'info',
  },
]

export const costItems: CostItem[] = [
  { service: 'Amazon EC2', category: 'Compute', quantity: 3, hours: 720, monthly: 184, annual: 2208, icon: 'dns', iconTone: 'info' },
  { service: 'Amazon RDS', category: 'Database', quantity: 1, hours: 720, monthly: 96, annual: 1152, icon: 'storage', iconTone: 'warning' },
  { service: 'Amazon S3', category: 'Storage', quantity: 2, hours: 720, monthly: 42, annual: 504, icon: 'database', iconTone: 'success' },
  { service: 'CloudFront', category: 'Delivery', quantity: 1, hours: 720, monthly: 31, annual: 372, icon: 'public', iconTone: 'info' },
  { service: 'Route 53', category: 'Networking', quantity: 1, hours: 720, monthly: 16, annual: 192, icon: 'language', iconTone: 'neutral' },
]

export const costTrend = [
  { month: 'Abr', cost: 286 },
  { month: 'May', cost: 302 },
  { month: 'Jun', cost: 318 },
  { month: 'Jul', cost: 341 },
  { month: 'Ago', cost: 352 },
  { month: 'Sep', cost: 369 },
]

export const costDistribution = [
  { name: 'Compute', value: 184, fill: '#2563eb' },
  { name: 'Database', value: 96, fill: '#f59e0b' },
  { name: 'Storage', value: 42, fill: '#16a34a' },
  { name: 'Delivery', value: 31, fill: '#7c3aed' },
  { name: 'Networking', value: 16, fill: '#64748b' },
]

export const securityChecks: SecurityCheck[] = [
  { label: 'Modelo de responsabilidad compartida', detail: 'Controles Cloud configurados', status: 'Correcto', tone: 'success', icon: 'verified_user' },
  { label: 'Identidades y accesos IAM', detail: 'Roles con mínimo privilegio', status: 'Correcto', tone: 'success', icon: 'manage_accounts' },
  { label: 'Protección de cuentas', detail: 'MFA pendiente en 1 usuario', status: 'Revisión', tone: 'warning', icon: 'lock_person' },
  { label: 'Protección de datos', detail: 'Cifrado activo en recursos', status: 'Correcto', tone: 'success', icon: 'encrypted' },
  { label: 'Cumplimiento', detail: '2 políticas requieren atención', status: 'Atención', tone: 'danger', icon: 'policy' },
]

export const regions: Region[] = [
  { name: 'US East (N. Virginia)', location: 'Estados Unidos', code: 'us-east-1', services: ['EC2', 'S3', 'RDS', 'VPC'], resources: 48, availability: '99.99%', status: 'Operativa', tone: 'success' },
  { name: 'EU (Ireland)', location: 'Irlanda', code: 'eu-west-1', services: ['EC2', 'S3', 'CloudFront'], resources: 21, availability: '99.98%', status: 'Operativa', tone: 'success' },
  { name: 'South America (São Paulo)', location: 'Brasil', code: 'sa-east-1', services: ['S3', 'CloudFront'], resources: 9, availability: '99.95%', status: 'Revisión', tone: 'warning' },
]

export const monthlyTotal = costItems.reduce((total, item) => total + item.monthly, 0)
