import { useMemo, type FormEvent, type ReactNode } from 'react'
import { regions, services } from '../data/cloudData'
import { Icon } from '../components/Icon'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { usePersistentState } from '../hooks/usePersistentState'
import type { SolutionPlan } from '../types/planning'

type SolutionForm = SolutionPlan

const initialForm: SolutionForm = {
  solutionName: '',
  applicationType: 'Web empresarial',
  description: '',
  region: 'us-east-1',
  users: '',
  availability: 'Alta · 99.9%',
  objective: 'Modernización',
  selectedServices: [],
}

const controlClasses = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'

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
  const [form, setForm] = usePersistentState<SolutionForm>('cloudfoundations.solutionForm', initialForm)
  const [savedProposal, setSavedProposal] = usePersistentState<SolutionForm | null>('cloudfoundations.savedProposal', null)
  const [proposalHistory, setProposalHistory] = usePersistentState<SolutionForm[]>('cloudfoundations.proposalHistory', [])
  const selectedServices = useMemo(() => services.filter((service) => form.selectedServices.includes(service.id)), [form.selectedServices])
  const proposalPreview = savedProposal ?? form
  const proposalServices = useMemo(
    () => services.filter((service) => proposalPreview.selectedServices.includes(service.id)),
    [proposalPreview.selectedServices],
  )
  const selectedRegion = regions.find((region) => region.code === form.region) ?? regions[0]
  const savedRegion = regions.find((region) => region.code === proposalPreview.region) ?? regions[0]
  const activeRegion = savedProposal ? savedRegion : selectedRegion

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
    const nextProposal = { ...form, selectedServices: [...form.selectedServices] }
    setSavedProposal(nextProposal)
    setProposalHistory((current) => [nextProposal, ...current])
  }

  const handleReset = () => {
    setForm(initialForm)
    setSavedProposal(null)
  }

  const getProposalServiceNames = (proposal: SolutionForm) => services
    .filter((service) => proposal.selectedServices.includes(service.id))
    .map((service) => service.name)

  const loadProposal = (proposal: SolutionForm) => {
    setForm(proposal)
    setSavedProposal(proposal)
  }

  const deleteProposal = (proposal: SolutionForm) => {
    setProposalHistory((current) => current.filter((item) => item.solutionName !== proposal.solutionName || item.description !== proposal.description || item.region !== proposal.region))
    if (savedProposal && savedProposal.solutionName === proposal.solutionName && savedProposal.region === proposal.region && savedProposal.description === proposal.description) {
      setSavedProposal(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Planificación Cloud</p>
        <h2 className="text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Define tu solución</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-500">Registra los objetivos, el contexto de negocio y los componentes principales de tu propuesta de arquitectura.</p>
      </header>

      {savedProposal && <Alert role="status" className="rounded-2xl border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm"><Icon name="check_circle" className="text-[21px] text-emerald-600" /><AlertDescription><strong className="block text-sm text-emerald-800">Propuesta registrada correctamente</strong><span className="mt-1 block text-xs text-emerald-700">La configuración quedó disponible en el resumen de la derecha.</span></AlertDescription></Alert>}

      <div className="grid min-w-0 items-start gap-5 min-[1180px]:grid-cols-2">
        <PlanningCard title="Información de la solución" subtitle="Completa los datos generales del proyecto.">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Nombre de la solución" id="solution-name">
                  <Input id="solution-name" required value={form.solutionName} onChange={(event) => updateField('solutionName', event.target.value)} placeholder="Ej. Plataforma e-commerce Nova" className={controlClasses} />
                </FormField>
              </div>

              <FormField label="Tipo de aplicación" id="application-type">
                <Select value={form.applicationType} onValueChange={(value) => updateField('applicationType', value)}>
                  <SelectTrigger id="application-type" className={`${controlClasses} justify-between`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web empresarial">Web empresarial</SelectItem>
                    <SelectItem value="API / Backend">API / Backend</SelectItem>
                    <SelectItem value="Aplicación móvil">Aplicación móvil</SelectItem>
                    <SelectItem value="Procesamiento de datos">Procesamiento de datos</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Descripción" id="description">
                  <Textarea id="description" required value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Describe el contexto, las necesidades y el alcance de la solución." className={`${controlClasses} min-h-32 resize-y py-3 leading-6`} />
                </FormField>
              </div>

              <FormField label="Región seleccionada" id="region">
                <Select value={form.region} onValueChange={(value) => updateField('region', value)}>
                  <SelectTrigger id="region" className={`${controlClasses} justify-between`}><SelectValue /></SelectTrigger>
                  <SelectContent>{regions.map((region) => <SelectItem value={region.code} key={region.code}>{region.code} · {region.name}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>

              <FormField label="Número estimado de usuarios" id="users" hint="Usuarios activos / mes">
                <Input id="users" required min="1" type="number" value={form.users} onChange={(event) => updateField('users', event.target.value)} className={controlClasses} />
              </FormField>

              <FormField label="Nivel de disponibilidad requerido" id="availability">
                <Select value={form.availability} onValueChange={(value) => updateField('availability', value)}>
                  <SelectTrigger id="availability" className={`${controlClasses} justify-between`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estándar · 99%">Estándar · 99%</SelectItem>
                    <SelectItem value="Alta · 99.9%">Alta · 99.9%</SelectItem>
                    <SelectItem value="Crítica · 99.99%">Crítica · 99.99%</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Objetivo de la migración" id="objective">
                <Select value={form.objective} onValueChange={(value) => updateField('objective', value)}>
                  <SelectTrigger id="objective" className={`${controlClasses} justify-between`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modernización">Modernización</SelectItem>
                    <SelectItem value="Reducción de costos">Reducción de costos</SelectItem>
                    <SelectItem value="Continuidad operativa">Continuidad operativa</SelectItem>
                    <SelectItem value="Escalabilidad">Escalabilidad</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
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

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-slate-400">Los datos se guardan como propuesta local.</span><div className="flex flex-col-reverse gap-2 sm:flex-row"><Button type="button" size="lg" variant="outline" onClick={handleReset} className="text-sm font-bold">Limpiar</Button><Button type="submit" size="lg" disabled={selectedServices.length === 0} className="bg-blue-600 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed"><Icon name="save" className="text-[18px]" />Guardar propuesta</Button></div></div>
          </form>
        </PlanningCard>

        <div className="flex w-full min-w-0 max-w-full flex-col gap-5 min-[1180px]:sticky min-[1180px]:top-24">
          <PlanningCard title={savedProposal ? 'Propuesta registrada' : 'Vista previa'} subtitle={savedProposal ? 'Información guardada de la solución.' : 'Resumen de la configuración actual.'} action={<Badge variant="outline" className={`border-0 px-2.5 py-1 text-[11px] ${savedProposal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}><span className="size-1.5 rounded-full bg-current" />{savedProposal ? 'Registrada' : 'Borrador'}</Badge>}>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Icon name="cloud_queue" className="text-[23px]" /></div><div className="min-w-0"><strong className="block truncate text-base font-bold text-slate-800">{proposalPreview.solutionName || 'Nueva solución Cloud'}</strong><span className="mt-1 block text-xs text-slate-500">{proposalPreview.applicationType} · {activeRegion.name}</span></div></div>
              <dl className="mt-5 grid grid-cols-2 gap-2"><SummaryItem label="Región" value={proposalPreview.region} /><SummaryItem label="Usuarios" value={Number(proposalPreview.users || 0).toLocaleString('en-US')} /><SummaryItem label="Disponibilidad" value={proposalPreview.availability} /><SummaryItem label="Objetivo" value={proposalPreview.objective} /></dl>
              <div className="mt-3 rounded-xl border border-slate-100 bg-white/80 p-3"><span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Descripción</span><p className="mt-1.5 text-xs leading-5 text-slate-600">{proposalPreview.description || 'Añade una descripción para completar la propuesta.'}</p></div>
            </div>

            <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Servicios incluidos</p><span className="text-xs font-bold text-slate-500">{proposalServices.length}</span></div><div className="mt-3 divide-y divide-slate-100">{proposalServices.length > 0 ? proposalServices.map((service) => <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0" key={service.id}><ServiceIcon tone={service.iconTone} icon={service.icon} /><div className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-700">{service.name}</span><span className="mt-1 block text-[11px] leading-5 text-slate-500">{service.purpose}</span></div><Icon name="check_circle" className="mt-1 text-[19px] text-emerald-600" /></div>) : <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">Selecciona al menos un servicio para completar la propuesta.</p>}</div></div>
          </PlanningCard>

          {proposalHistory.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Almacén de propuestas</p>
                  <h3 className="mt-1 text-base font-bold text-slate-800">Propuestas creadas</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{proposalHistory.length}</span>
              </div>

              <div className="mt-4 space-y-3">
                {proposalHistory.map((proposal, index) => {
                  const proposalServiceNames = getProposalServiceNames(proposal)
                  return (
                    <div key={`${proposal.solutionName}-${proposal.region}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">{proposal.solutionName}</p>
                          <p className="mt-1 text-[11px] text-slate-500">{proposal.applicationType} · {proposal.region}</p>
                        </div>
                        <Button type="button" size="xs" onClick={() => loadProposal(proposal)} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-blue-700">Cargar</Button>
                      </div>

                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-600">{proposal.description}</p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {proposalServiceNames.length > 0 ? proposalServiceNames.map((serviceName) => (
                          <span key={`${proposal.solutionName}-${serviceName}`} className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">{serviceName}</span>
                        )) : <span className="text-[10px] font-bold text-slate-400">Sin servicios seleccionados</span>}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-500">
                        <span>{proposal.selectedServices.length} servicios</span>
                        <Button type="button" variant="link" size="xs" onClick={() => deleteProposal(proposal)} className="h-auto p-0 font-bold text-red-600 hover:text-red-700">Eliminar</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
