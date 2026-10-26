export interface Inputs {
  rooms: number
  /** ocupação, em % */
  occupancy: number
  /** diária média (ADR), em R$ */
  adr: number
  /** receita extra por quarto ocupado (café, spa, bar), em R$ */
  ancillary: number
  /** custo variável por quarto ocupado (CPOR), em R$ */
  cpor: number
  /** custos fixos mensais, em R$ */
  fixed: number
  days: number
}

export interface Metrics {
  availableNights: number
  soldNights: number
  revpar: number
  trevpar: number
  revenue: number
  costs: number
  gop: number
  goppar: number
  /** ocupação mínima (%) para o GOP ficar em zero; null se a margem por quarto é <= 0 */
  breakEvenOccupancy: number | null
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))

export function metrics(i: Inputs): Metrics {
  const rooms = Math.max(0, Math.round(i.rooms || 0))
  const days = Math.max(0, Math.round(i.days || 0))
  const occ = clamp(i.occupancy, 0, 100) / 100
  const adr = Math.max(0, i.adr || 0)
  const anc = Math.max(0, i.ancillary || 0)
  const cpor = Math.max(0, i.cpor || 0)
  const fixed = Math.max(0, i.fixed || 0)

  const available = rooms * days
  const sold = available * occ
  const revenue = sold * (adr + anc)
  const costs = sold * cpor + fixed
  const gop = revenue - costs
  const margin = adr + anc - cpor

  return {
    availableNights: available,
    soldNights: sold,
    revpar: adr * occ,
    trevpar: (adr + anc) * occ,
    revenue,
    costs,
    gop,
    goppar: available ? gop / available : 0,
    breakEvenOccupancy: margin > 0 && available ? (fixed / (available * margin)) * 100 : null,
  }
}

/** RevPAR para cada combinação de variação de ADR (linhas) e ocupação (colunas). */
export function revparGrid(adr: number, occupancies: number[], adrDeltas: number[]): number[][] {
  return adrDeltas.map((d) => occupancies.map((o) => adr * (1 + d / 100) * (clamp(o, 0, 100) / 100)))
}

export const brl = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

export const brl2 = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export const pct = (n: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(n) + '%'
