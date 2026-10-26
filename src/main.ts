import '@fontsource-variable/instrument-sans'
import './styles/base.css'
import './styles/app.css'
import { brl, brl2, metrics, pct, revparGrid } from './lib/revpar'
import { countTo, initMotion } from './motion'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const num = (id: string) => parseFloat($<HTMLInputElement>(id).value) || 0

const OCCS = [40, 50, 60, 70, 80, 90, 100]
const DELTAS = [-20, -10, 0, 10, 20]

function update() {
  const occupancy = num('occ')
  const adr = num('adr')
  $('occ-out').textContent = `${occupancy}%`
  $('adr-out').textContent = brl(adr)

  const m = metrics({
    rooms: num('rooms'),
    occupancy,
    adr,
    ancillary: num('anc'),
    cpor: num('cpor'),
    fixed: num('fixed'),
    days: 30,
  })

  countTo($('revpar'), m.revpar, brl2)
  $('revpar-sub').textContent = `${Math.round(m.soldNights)} de ${m.availableNights} noites vendidas no mês.`

  $('stats').innerHTML = [
    ['TRevPAR', brl2(m.trevpar)],
    ['GOPPAR', brl2(m.goppar)],
    ['Receita no mês', brl(m.revenue)],
    ['GOP no mês', brl(m.gop)],
  ]
    .map(([k, v]) => `<li><span>${k}</span><strong${v.includes('-') ? ' class="neg"' : ''}>${v}</strong></li>`)
    .join('')

  const be = m.breakEvenOccupancy
  $('be').innerHTML =
    be === null
      ? '<p>Com esses valores a margem por quarto ocupado é zero ou negativa: nenhuma ocupação cobre os custos fixos.</p>'
      : `<p>Ocupação de equilíbrio: <strong>${pct(be)}</strong>${
          be > 100 ? ' (acima de 100%, o mês não fecha no azul)' : occupancy >= be ? ` · você está ${pct(occupancy - be)} acima` : ` · faltam ${pct(be - occupancy)}`
        }</p>
        <div class="meter" style="--occ:${occupancy};--be:${Math.min(be, 100)}" role="img" aria-label="Ocupação atual ${occupancy}% contra equilíbrio de ${pct(be)}"><i></i><b></b></div>`

  const grid = revparGrid(adr, OCCS, DELTAS)
  const flat = grid.flat()
  const lo = Math.min(...flat)
  const hi = Math.max(...flat)
  const t = (v: number) => (hi === lo ? 0.5 : 0.08 + ((v - lo) / (hi - lo)) * 0.92)
  $('heat').innerHTML =
    `<thead><tr><th scope="col">Diária</th>${OCCS.map((o) => `<th scope="col">${o}%</th>`).join('')}</tr></thead><tbody>` +
    grid
      .map(
        (row, r) =>
          `<tr${DELTAS[r] === 0 ? ' class="base"' : ''}><th scope="row">${DELTAS[r] > 0 ? '+' : ''}${DELTAS[r]}% · ${brl(adr * (1 + DELTAS[r] / 100))}</th>${row
            .map((v) => `<td class="${t(v) > 0.55 ? 'hi' : ''}" style="--t:${t(v).toFixed(2)}">${brl(v)}</td>`)
            .join('')}</tr>`,
      )
      .join('') +
    '</tbody>'
}

;['occ', 'adr', 'rooms', 'anc', 'cpor', 'fixed'].forEach((id) => $(id).addEventListener('input', update))
update()
initMotion()
