import { describe, expect, it } from 'vitest'
import { metrics, revparGrid, type Inputs } from './revpar'

const base: Inputs = { rooms: 20, occupancy: 70, adr: 300, ancillary: 40, cpor: 80, fixed: 60000, days: 30 }

describe('revpar', () => {
  it('RevPAR = ADR × ocupação', () => {
    expect(metrics(base).revpar).toBeCloseTo(210)
  })

  it('TRevPAR inclui receita extra', () => {
    expect(metrics(base).trevpar).toBeCloseTo(238)
  })

  it('receita, custos e GOP mensais', () => {
    const m = metrics(base)
    expect(m.availableNights).toBe(600)
    expect(m.soldNights).toBeCloseTo(420)
    expect(m.revenue).toBeCloseTo(142800)
    expect(m.costs).toBeCloseTo(93600)
    expect(m.gop).toBeCloseTo(49200)
    expect(m.goppar).toBeCloseTo(82)
  })

  it('ocupação de equilíbrio zera o GOP', () => {
    const be = metrics(base).breakEvenOccupancy!
    // 60000 / (600 noites × (300 + 40 − 80))
    expect(be).toBeCloseTo(38.46, 1)
    expect(metrics({ ...base, occupancy: be }).gop).toBeCloseTo(0, 4)
  })

  it('sem margem por quarto não há equilíbrio possível', () => {
    expect(metrics({ ...base, cpor: 400 }).breakEvenOccupancy).toBeNull()
  })

  it('limita ocupação e ignora entradas inválidas', () => {
    expect(metrics({ ...base, occupancy: 250 }).revpar).toBeCloseTo(300)
    expect(metrics({ ...base, adr: NaN, rooms: -3 }).revenue).toBe(0)
  })

  it('grade de sensibilidade', () => {
    const g = revparGrid(300, [50, 100], [-10, 0])
    expect(g[0][0]).toBeCloseTo(135)
    expect(g[1][1]).toBeCloseTo(300)
  })
})
