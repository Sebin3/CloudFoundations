type IconProps = {
  name: string
  className?: string
  filled?: boolean
}

function IconGlyph({ name, filled }: { name: string; filled: boolean }) {
  const common = { fill: filled ? 'currentColor' : 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  if (['check_circle', 'radio_button_checked', 'verified_user'].includes(name)) return <><circle cx="12" cy="12" r="9" {...common} /><path d="m8 12 2.5 2.5L16.5 8.5" {...common} /></>
  if (['warning', 'priority_high', 'error'].includes(name)) return <><path d="M12 3 2.8 20h18.4L12 3Z" {...common} /><path d="M12 9v4.5M12 17h.01" {...common} /></>
  if (['cloud', 'cloud_queue'].includes(name)) return <path d="M6.5 18.5h10.3a4.2 4.2 0 0 0 .7-8.35A6 6 0 0 0 6.2 8.3a5.1 5.1 0 0 0 .3 10.2Z" {...common} />
  if (['dashboard', 'apps', 'category'].includes(name)) return <><rect x="3" y="3" width="7" height="7" rx="1.5" {...common} /><rect x="14" y="3" width="7" height="7" rx="1.5" {...common} /><rect x="3" y="14" width="7" height="7" rx="1.5" {...common} /><rect x="14" y="14" width="7" height="7" rx="1.5" {...common} /></>
  if (['hub', 'account_tree', 'alt_route'].includes(name)) return <><circle cx="12" cy="5" r="2" {...common} /><circle cx="5" cy="18" r="2" {...common} /><circle cx="19" cy="18" r="2" {...common} /><path d="M12 7v4M5 16v-3h14v3" {...common} /></>
  if (['dns', 'storage'].includes(name)) return <><rect x="4" y="3" width="16" height="7" rx="2" {...common} /><rect x="4" y="14" width="16" height="7" rx="2" {...common} /><path d="M8 6.5h.01M8 17.5h.01M12 6.5h5M12 17.5h5" {...common} /></>
  if (name === 'database') return <><ellipse cx="12" cy="5" rx="7" ry="3" {...common} /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" {...common} /></>
  if (['public', 'language', 'travel_explore'].includes(name)) return <><circle cx="12" cy="12" r="9" {...common} /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...common} /></>
  if (name === 'location_on') return <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" {...common} /><circle cx="12" cy="10" r="2.5" {...common} /></>
  if (['shield', 'security', 'admin_panel_settings', 'policy'].includes(name)) return <><path d="M12 3 4.5 6v5.5c0 4.8 3.1 8 7.5 9.5 4.4-1.5 7.5-4.7 7.5-9.5V6L12 3Z" {...common} /><path d="m9 12 2 2 4-4" {...common} /></>
  if (['lock', 'encrypted', 'lock_person', 'shield_lock'].includes(name)) return <><rect x="4" y="10" width="16" height="11" rx="2" {...common} /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" {...common} /></>
  if (['monitoring', 'bar_chart', 'speed', 'monitor_heart'].includes(name)) return <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...common} /></>
  if (['sync', 'refresh'].includes(name)) return <><path d="M20 7v5h-5M4 17v-5h5" {...common} /><path d="M6.1 8a7 7 0 0 1 11.7-2L20 8M4 16l2.2 2a7 7 0 0 0 11.7-2" {...common} /></>
  if (name === 'search' || name === 'search_off') return <><circle cx="10.5" cy="10.5" r="6.5" {...common} /><path d="m15.5 15.5 5 5" {...common} />{name === 'search_off' && <path d="M4 4 20 20" {...common} />}</>
  if (name === 'notifications' || name === 'notifications_active') return <><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7Z" {...common} /><path d="M10 20h4" {...common} /></>
  if (['arrow_forward', 'east'].includes(name)) return <><path d="M5 12h14M14 7l5 5-5 5" {...common} /></>
  if (['arrow_downward', 'south'].includes(name)) return <><path d="M12 5v14M7 14l5 5 5-5" {...common} /></>
  if (name === 'expand_more') return <path d="m6 9 6 6 6-6" {...common} />
  if (name === 'menu') return <><path d="M4 7h16M4 12h16M4 17h16" {...common} /></>
  if (name === 'close') return <path d="m6 6 12 12M18 6 6 18" {...common} />
  if (name === 'calendar_month') return <><rect x="3" y="5" width="18" height="16" rx="2" {...common} /><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 18h3" {...common} /></>
  if (['show_chart', 'trending_up'].includes(name)) return <><path d="m4 17 5-5 4 3 7-8" {...common} /><path d="M15 7h5v5" {...common} /></>
  if (name === 'radio_button_unchecked') return <circle cx="12" cy="12" r="8" {...common} />
  if (name === 'business_center') return <><rect x="3" y="7" width="18" height="13" rx="2" {...common} /><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2" {...common} /></>
  if (name === 'unfold_more') return <><path d="m8 7 4-4 4 4M8 17l4 4 4-4" {...common} /></>
  if (name === 'more_horiz' || name === 'more_vert') return <>{[6, 12, 18].map((value) => <circle key={value} cx={name === 'more_horiz' ? value : 12} cy={name === 'more_horiz' ? 12 : value} r="1.3" fill="currentColor" />)}</>
  if (['add', 'add_circle_outline'].includes(name)) return <><circle cx="12" cy="12" r="9" {...common} /><path d="M12 8v8M8 12h8" {...common} /></>
  if (name === 'remove') return <><circle cx="12" cy="12" r="9" {...common} /><path d="M8 12h8" {...common} /></>
  if (name === 'edit_note') return <><path d="M4 5h10M4 10h8M4 15h6" {...common} /><path d="m13 18 6-6 2 2-6 6-3 1 1-3Z" {...common} /></>
  if (name === 'payments') return <><rect x="3" y="5" width="18" height="14" rx="2" {...common} /><path d="M3 9h18M7 15h4" {...common} /></>
  if (name === 'router') return <><rect x="3" y="11" width="18" height="8" rx="2" {...common} /><path d="M8 11V7M16 11V5M7 15h.01M11 15h.01" {...common} /></>
  if (name === 'balance') return <><path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6ZM17 6l-4 7h8l-4-7ZM8 21h8" {...common} /></>
  if (name === 'network_check') return <><path d="M3 17h2M7 14h2M11 11h2M15 8h2M19 5h2" {...common} /><path d="m14 17 2 2 5-5" {...common} /></>
  if (name === 'tips_and_updates') return <><path d="M9 18h6M10 21h4" {...common} /><path d="M8 14a6 6 0 1 1 8 0c-1 .8-1 1.5-1 2H9c0-.5 0-1.2-1-2Z" {...common} /></>
  if (name === 'save') return <><path d="M4 3h13l3 3v15H4V3Z" {...common} /><path d="M8 3v6h8V3M8 21v-7h8v7" {...common} /></>
  if (name === 'download') return <><path d="M12 3v12M7 10l5 5 5-5M4 20h16" {...common} /></>
  if (name === 'info') return <><circle cx="12" cy="12" r="9" {...common} /><path d="M12 11v6M12 7h.01" {...common} /></>
  if (name === 'support_agent') return <><path d="M4 13v-2a8 8 0 0 1 16 0v2" {...common} /><rect x="3" y="12" width="4" height="6" rx="2" {...common} /><rect x="17" y="12" width="4" height="6" rx="2" {...common} /><path d="M17 19c-1 2-3 2-5 2" {...common} /></>
  if (name === 'manage_accounts') return <><circle cx="9" cy="8" r="3" {...common} /><path d="M3 20c0-4 2-7 6-7 2 0 3.5.7 4.5 2M18 13v7M14.5 16.5h7" {...common} /></>
  return <><circle cx="12" cy="12" r="9" {...common} /><path d="M8 12h8M12 8v8" {...common} /></>
}

export function Icon({ name, className = '', filled = false }: IconProps) {
  const hasExplicitSize = /text-\[(?:\d+px|\d+rem)\]|text-(?:xs|sm|base|lg|xl|[2-9]xl)/.test(className)
  const size = hasExplicitSize ? '1em' : '22px'
  return <svg viewBox="0 0 24 24" width={size} height={size} className={`inline-block shrink-0 align-middle ${className}`} aria-hidden="true"><IconGlyph name={name} filled={filled} /></svg>
}
