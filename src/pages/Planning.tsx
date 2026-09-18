import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { regions, services } from '../data/cloudData'
import { Icon } from '../components/Icon'
import { usePersistentState } from '../hooks/usePersistentState'

type SolutionForm = {
  solutionName: string
  applicationType: string
  description: string
  region: string
  users: string
  availability: string
  objective: string
  selectedServices: string[]
}

const initialForm: SolutionForm = {
  solutionName: 'Plataforma e-commerce Nova',
  applicationType: 'Web empresarial',
  description: 'Plataforma escalable para gestionar ventas, inventario y operaciones digitales.',
  region: 'us-east-1',
  users: '12000',
  availability: 'Alta · 99.9%',
  objective: 'Modernización',
  selectedServices: ['ec2', 'rds', 's3'],
}

const controlClasses = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'

function PlanningCard({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`w-full max-w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">{title}</h3>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function FormField({ label, id, hint, children }: { label: string; id: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-slate-700">{label}<span className="ml-1 text-blue-600">*</span></label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function ServiceIcon({ tone, icon }: { tone: string; icon: string }) {
  const classes = tone === 'warning' ? 'bg-amber-50 text-amber-600' : tone === 'success' ? 'bg-emerald-50 text-emerald-600' : tone === 'neutral' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'
  return <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${classes}`}><Icon name={icon} className="text-[19px]" /></div>
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"><dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</dt><dd className="mt-1.5 truncate text-sm font-bold text-slate-800">{value}</dd></div>
}

export function Planning() {
  const [isCompactViewport, setIsCompactViewport] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1180)
  const [form, setForm] = usePersistentState<SolutionForm>('cloudfoundations.solutionForm', initialForm)
  const [savedProposal, setSavedProposal] = usePersistentState<SolutionForm | null>('cloudfoundations.savedProposal', null)
  const selectedServices = useMemo(() => services.filter((service) => form.selectedServices.includes(service.id)), [form.selectedServices])
  const selectedRegion = regions.find((region) => region.code === form.region) ?? regions[0]

  useEffect(() => {
    const syncViewport = () => setIsCompactViewport(window.innerWidth < 1180)
    window.addEventListener('resize', syncViewport)
    syncViewport()
    return () => window.removeEventListener('resize', syncViewport)
  }, [])

  const updateField = <K extends keyof SolutionForm>(field: K, value: SolutionForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSavedProposal(null)
  }

  const toggleService = (id: string) => {
    const nextServices = form.selectedServices.includes(id)
      ? form.selectedServices.filter((serviceId) => serviceId !== id)
      : [...form.selectedServices, id]
    updateField('selectedServices', nextServices)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavedProposal({ ...form, selectedServices: [...form.selectedServices] })
  }

  const handleReset = () => {
    setForm(initialForm)
    setSavedProposal(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Planificación Cloud</p>
        <h2 className="text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Define tu solución</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-500">Registra los objetivos, el contexto de negocio y los componentes principales de tu propuesta de arquitectura.</p>
      </header>

      {savedProposal && <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm"><Icon name="check_circle" className="mt-0.5 text-[21px] text-emerald-600" /><div><strong className="block text-sm">Propuesta registrada correctamente</strong><span className="mt-1 block text-xs text-emerald-700">La configuración quedó disponible en el resumen de la derecha.</span></div></div>}

      <div className={`grid min-w-0 items-start gap-5 ${isCompactViewport ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <PlanningCard title="Información de la solución" subtitle="Completa los datos generales del proyecto.">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2"><FormField label="Nombre de la solución" id="solution-name"><input id="solution-name" required value={form.solutionName} onChange={(event) => updateField('solutionName', event.target.value)} placeholder="Ej. Plataforma e-commerce Nova" className={controlClasses} /></FormField></div>
              <FormField label="Tipo de aplicación" id="application-type"><select id="application-type" required value={form.applicationType} onChange={(event) => updateField('applicationType', event.target.value)} className={controlClasses}><option>Web empresarial</option><option>API / Backend</option><option>Aplicación móvil</option><option>Procesamiento de datos</option></select></FormField>
              <FormField label="Región seleccionada" id="region"><select id="region" required value={form.region} onChange={(event) => updateField('region', event.target.value)} className={controlClasses}>{regions.map((region) => <option value={region.code} key={region.code}>{region.code} · {region.name}</option>)}</select></FormField>
              <FormField label="Número estimado de usuarios" id="users" hint="Usuarios activos / mes"><input id="users" required min="1" type="number" value={form.users} onChange={(event) => updateField('users', event.target.value)} className={controlClasses} /></FormField>
              <FormField label="Nivel de disponibilidad requerido" id="availability"><select id="availability" required value={form.availability} onChange={(event) => updateField('availability', event.target.value)} className={controlClasses}><option>Estándar · 99%</option><option>Alta · 99.9%</option><option>Crítica · 99.99%</option></select></FormField>
              <div className="md:col-span-2"><FormField label="Descripción" id="description"><textarea id="description" required value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Describe el contexto, las necesidades y el alcance de la solución." className={`${controlClasses} min-h-32 resize-y leading-6`} /></FormField></div>
              <div className="md:col-span-2"><FormField label="Objetivo de la migración" id="objective"><select id="objective" required value={form.objective} onChange={(event) => updateField('objective', event.target.value)} className={controlClasses}><option>Modernización</option><option>Reducción de costos</option><option>Continuidad operativa</option><option>Escalabilidad</option></select></FormField></div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h4 className="text-base font-bold text-slate-800">Servicios Cloud seleccionados</h4><p className="mt-1 text-xs text-slate-500">Selecciona los componentes que formarán parte de la arquitectura.</p></div><span className="text-xs font-bold text-blue-600">{selectedServices.length} seleccionados</span></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {services.map((service) => {
                  const isSelected = form.selectedServices.includes(service.id)
                  return <button type="button" aria-pressed={isSelected} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${isSelected ? 'border-blue-200 bg-blue-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'}`} key={service.id} onClick={() => toggleService(service.id)}><ServiceIcon tone={service.iconTone} icon={service.icon} /><span className="min-w-0 flex-1"><strong className="block truncate text-sm font-bold text-slate-800">{service.name}</strong><span className="mt-0.5 block text-xs text-slate-400">{service.category}</span>{isSelected && <span className="mt-1.5 block text-[11px] leading-5 text-slate-600">{service.description}</span>}</span><Icon name={isSelected ? 'check_circle' : 'add_circle_outline'} className={`text-[20px] ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} /></button>
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-slate-400">Los datos se guardan como propuesta local.</span><div className="flex flex-col-reverse gap-2 sm:flex-row"><button type="button" onClick={handleReset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">Limpiar</button><button type="submit" disabled={selectedServices.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.16)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"> <Icon name="save" className="text-[18px]" />Guardar propuesta</button></div></div>
          </form>
        </PlanningCard>

        <div className={`flex w-full min-w-0 max-w-full flex-col gap-5 ${isCompactViewport ? '' : 'sticky top-24'}`}>
          <PlanningCard title={savedProposal ? 'Propuesta registrada' : 'Vista previa'} subtitle={savedProposal ? 'Información guardada de la solución.' : 'Resumen de la configuración actual.'} action={<span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${savedProposal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}><span className="size-1.5 rounded-full bg-current" />{savedProposal ? 'Registrada' : 'Borrador'}</span>}>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Icon name="cloud_queue" className="text-[23px]" /></div><div className="min-w-0"><strong className="block truncate text-base font-bold text-slate-800">{form.solutionName || 'Nueva solución Cloud'}</strong><span className="mt-1 block text-xs text-slate-500">{form.applicationType} · {selectedRegion.name}</span></div></div>
              <dl className="mt-5 grid grid-cols-2 gap-2"><SummaryItem label="Región" value={form.region} /><SummaryItem label="Usuarios" value={Number(form.users || 0).toLocaleString('en-US')} /><SummaryItem label="Disponibilidad" value={form.availability} /><SummaryItem label="Objetivo" value={form.objective} /></dl>
              <div className="mt-3 rounded-xl border border-slate-100 bg-white/80 p-3"><span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Descripción</span><p className="mt-1.5 text-xs leading-5 text-slate-600">{form.description || 'Añade una descripción para completar la propuesta.'}</p></div>
            </div>
            <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Servicios incluidos</p><span className="text-xs font-bold text-slate-500">{selectedServices.length}</span></div><div className="mt-3 divide-y divide-slate-100">{selectedServices.length > 0 ? selectedServices.map((service) => <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0" key={service.id}><ServiceIcon tone={service.iconTone} icon={service.icon} /><div className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-700">{service.name}</span><span className="mt-1 block text-[11px] leading-5 text-slate-500">{service.purpose}</span></div><Icon name="check_circle" className="mt-1 text-[19px] text-emerald-600" /></div>) : <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">Selecciona al menos un servicio para completar la propuesta.</p>}</div></div>
          </PlanningCard>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300"><Icon name="tips_and_updates" className="text-[21px]" /></div><div><h3 className="text-sm font-bold">Siguiente paso recomendado</h3><p className="mt-1.5 text-xs leading-5 text-slate-300">Después de registrar la propuesta, revisa costos, seguridad y topología antes de pasar a la implementación.</p></div></div></div>
        </div>
      </div>
    </div>
  )
}
