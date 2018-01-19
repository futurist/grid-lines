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
  let V = i>=lines-1 ? 'B' : i==0 ? 'T' : 'C'
  let H = j>=cols-1 ? 'R' : j==0 ? 'L' : 'C'
  return [H, V]
}
function gridLines(lines, cols, opt){
  const ret = []
  opt = objutil.merge({}, defaultOptions, opt)
  const {style, regions} = opt
  style.CB=style.CB||style.LB
  style.RC=style.RC||style.RT
  for(let i=0;i<lines; i++){
    ret.push('<tr>')
    for(let j=0;j<cols; j++){
      let [H, V] = getParts(i, j, lines, cols)
      let css = objutil.assign({}, style[H+V] || style.LT)
      if(Array.isArray(regions)){
        regions.forEach(arr=>{
          let [x,y,w,h] = arr
          let rh = y+h
          let rw = x+w
          if(i>=y && i<rh && j>=x && j<rw) {
            let [H2, V2] = getParts(i,j,rh, rw)
            // console.log(i,j,H2,V2)
            // corner case, i==0, lines==1, T will B!!
            if(V2!='B') css.borderBottom = 0
            if(H2!='R') css.borderRight=0
          }
        })
      }
      ret.push('<td style="'+inlineStyle(css)+'">', i*cols+j, '</td>')
    }
    ret.push('</tr>')
  }
  return ret.join(opt.newLine)
}

require('fs').writeFileSync('test.html', `<table cellpadding=0 cellspacing=0>${gridLines(8,9, {regions:[[1,2,1,2],[3,4,2,2]], style:{LT:{border:'1px solid red'}}})}</table>`, 'utf8')


