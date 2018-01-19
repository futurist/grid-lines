module.exports = gridLines

const objutil = require('objutil')

function dashify (str) {
  return str.replace(/[A-Z]/g, function (m) {
    return '-' + m.toLowerCase()
  })
}

//https://github.com/gummesson/inline-style
function inlineStyle(obj) {
  if (!obj||typeof obj!='object') return obj||''
  return Object.keys(obj).map(function(key) {
    return dashify(key) + ':' + obj[key]
  }).join(';')
}
// console.log(inlineStyle({border:'0', 'padding-left':'12px'}))
// console.log(inlineStyle('margin:0'))

var defaultOptions = {
  newLine: '\n',
  style:{
    LT: {border:'1px solid black', borderLeft:0, borderTop:0},
    RT: {borderBottom:'1px solid black'},
    LB: {borderRight:'1px solid black'},
    RB: {border:0}
  }
}
function gridLines(lines, cols, opt){
  const ret = []
  opt = objutil.merge({}, defaultOptions, opt)
  const {style} = opt
  style.CB=style.CB||style.LB
  style.RC=style.RC||style.RT
  for(let i=0;i<lines; i++){
    ret.push('<tr>')
    for(let j=0;j<cols; j++){
      const V = i==0 ? 'T' : i>=lines-1 ? 'B' : 'C'
      const H = j==0 ? 'L' : j>=cols-1 ? 'R' : 'C'
      const css = style[H+V] || style.LT
      ret.push('<td style="'+inlineStyle(css)+'">', i*cols+j, '</td>')
    }
    ret.push('</tr>')
  }
  return ret.join(opt.newLine)
}

require('fs').writeFileSync('test.html', `<table cellpadding=0 cellspacing=0>${gridLines(5,3, {style:{LT:{border:'1px solid red'}}})}</table>`, 'utf8')


