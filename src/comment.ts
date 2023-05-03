import {details, fragment, summary, table, tbody, th, tr} from './html'
import {BuildCommentInputs} from './interfaces'
import {tabulate} from './tabulate'

const renderEmoji = (diff: number): string => {
  if (diff < 0) return '❌'

  return '✅'
}

const isNumber = (val: string | number) => !isNaN(str) && !isNaN(parseFloat(str))

export const buildComment = ({results}: BuildCommentInputs): string => {
  const html = results.map(result => {
    let plus = ''
    let arrow = ''
    let diffHtml = ''
    let coverageHtml = ''

    if (result.diff !== null && isNumber(result.diff)) {
      if (result.diff < 0) {
        arrow = '▾'
      } else if (result.diff > 0) {
        plus = '+'
        arrow = '▴'
      }

      diffHtml = th(
        renderEmoji(result.diff),
        ' ',
        arrow,
        ' ',
        plus,
        result.diff.toFixed(2),
        '%'
      )
    }

    coverageHtml = isNumber(result.coverage) ? th(result.coverage.toFixed, '%') : th("N/A")

    const htmlResults = tabulate(result.details)

    return `${table(
      tbody(tr(th(result.app), th(result.coverage.toFixed(2), '%'), diffHtml))
    )} \n\n ${details(summary('Coverage Report'), htmlResults)} <br/>`
  })

  const title = `Code Coverage:<p></p>`

  return fragment(title, html.join(''))
}
