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
  },
}
function getParts(i, j, lines, cols){
  let V = i==0 ? 'T' : i>=lines-1 ? 'B' : 'C'
  let H = j==0 ? 'L' : j>=cols-1 ? 'R' : 'C'
  return [H, V]
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
      let [H, V] = getParts(i, j, lines, cols)
      let css = objutil.assign({}, style[H+V] || style.LT)
      let rh=2, rw=1
      if(i<rh&&j<rw) {
        let [H2, V2] = getParts(i,j,rh, rw)
        console.log(i,j,H2,V2)
        // corner case, i==0, lines==1, T will B!!
        if(i<rh-1 && V2!='B') css.borderBottom = 0
        if(j<rw-1 && H2!='R') css.borderRight=0
      }
      ret.push('<td style="'+inlineStyle(css)+'">', i*cols+j, '</td>')
    }
    ret.push('</tr>')
  }
  return ret.join(opt.newLine)
}

require('fs').writeFileSync('test.html', `<table cellpadding=0 cellspacing=0>${gridLines(5,3, {style:{LT:{border:'1px solid red'}}})}</table>`, 'utf8')


