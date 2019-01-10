/* eslint-env browser */
/* global swfobject */

// eslint-disable-next-line
function fp () {
  'use strict'
  var res = ''
  res += fpClock() + '\n'
  res += fpCanvas() + '\n'
  res += fpDisplay() + '\n'
  res += fpFlash() + '\n'
  res += fpFonts() + '\n'
//   res += fpFormFields() + '\n'
  res += fpIndexedDB() + '\n'
  res += fpJava() + '\n'
  res += fpLanguages() + '\n'
  res += fpMathRoutines() + '\n'
  res += fpNav() + '\n'
  res += fpSessionStorage() + '\n'
  res += fpTimezone() + '\n'

  return res
}

function hash (str) {
  var hash = 5381

  var i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0
}

function fpClock () {
  'use strict'

  try {
    var lngInitClk = performance.now()
    var lngDiffClk = performance.now() - lngInitClk
    for (var i = 0; i < 20; i++) {
      lngDiffClk = clockcalc(lngDiffClk, performance.now() - lngInitClk)
    }
    if (lngDiffClk === 0) {
      return 'clk:0'
    }
    return 'clk:' + (Math.round(1 / lngDiffClk))
  } catch (err) {
    console.error(err)
    return 'clk:-1'
  }
}

function clockcalc (lngDiff, lngElapse) {
  try {
    if (lngDiff < 0.00000001) {
      return lngElapse
    }
    if (lngDiff < lngElapse) {
      return clockcalc(lngElapse - Math.floor(lngElapse / lngDiff) * lngDiff, lngDiff)
    } else if (lngDiff === lngElapse) {
      return lngDiff
    } else {
      return clockcalc(lngElapse, lngDiff)
    }
  } catch (err) {
    return 0
  }
}

// Detect existence of session storage on device...
function fpSessionStorage () {
  'use strict'

  try {
    return 'ss:' + (window.sessionStorage ? 1 : 0)
  } catch (err) { // Error when referencing it confirms non existence
    return 'ss:0'
  }
}

// Detect existence of indexedDB on device...
function fpIndexedDB () {
  'use strict'

  try {
    return 'idb:' + (window.indexedDB ? 1 : 0)
  } catch (err) { // Error when referencing it confirms non existence
    return 'idb:0'
  }
}

// Fingerprint the timezone settings for the device...
function fpTimezone () {
  'use strict'

  try {
    var dtDate1 = new Date(2018, 0, 1)
    var dtDate2 = new Date(2018, 6, 1)
    var strOffset1 = dtDate1.getTimezoneOffset()
    var strOffset2 = dtDate2.getTimezoneOffset()
    return 'tz:' + strOffset1 + '|' + strOffset2
  } catch (err) {
    return 'tz:-1'
  }
}

// Fingerprints both COSH(10) and TAN(-1e300) for the device...
function fpMathRoutines () {
  'use strict'

  try {
    return 'mr:' + ((Math.exp(10) + 1 / Math.exp(10)) / 2) + '|' + Math.tan(-1e300)
  } catch (err) {
    return 'mr:-1'
  }
}

// Enumerate all navigator properties with a fixed value...
function fpNav () {
  'use strict'

  try {
    var ret = ''
    for (var strKey in navigator) {
      var val = navigator[strKey]
      if (val === null || (typeof val !== 'function' && typeof val !== 'object')) {
        var strValue = String(val)
        if (strValue === 'null') {
          strValue = 'NULL'
        }
        if (strValue === '') {
          strValue = '_'
        }
        ret += strKey + ':' + strValue + ','
      }
    }
    return 'n:' + hash(ret)
  } catch (err) {
    return 'n:-1'
  }
}

// Fingerprint the canvas...
function fpCanvas () {
  'use strict'

  var strText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?"

  try {
    var canvas = document.createElement('canvas')
    var strCText = canvas.getContext('2d')
    strCText.textBaseline = 'top'
    strCText.font = "14px 'Arial'"
    strCText.textBaseline = 'alphabetic'
    strCText.fillStyle = '#f60'
    strCText.fillRect(125, 1, 62, 20)
    strCText.fillStyle = '#069'
    strCText.fillText(strText, 2, 15)
    strCText.fillStyle = 'rgba(102, 204, 0, 0.7)'
    strCText.fillText(strText, 4, 17)
    return 'c:' + hash(canvas.toDataURL())
  } catch (err) {
    return 'c:-1'
  }
}

// Fingerprint languages...
function fpLanguages () {
  'use strict'

  var strLang = ''

  try {
    if (navigator.language) {
      strLang = 'lang=' + navigator.language + '|'
    } else {
      strLang = 'lang=' + 'undefined' + '|'
    }
    if (navigator.languages) {
      strLang = strLang + 'langs=' + navigator.languages + '|'
    } else {
      strLang = strLang + 'langs=' + 'undefined' + '|'
    }
    // Microsoft specific properties
    if (navigator.browserLanguage) {
      strLang = strLang + 'brlang=' + navigator.browserLanguage + '|'
    } else {
      strLang = strLang + 'brlang=' + 'undefined' + '|'
    }
    if (navigator.systemLanguage) {
      strLang = strLang + 'syslang=' + navigator.systemLanguage + '|'
    } else {
      strLang = strLang + 'syslang=' + 'undefined' + '|'
    }
    if (navigator.userLanguage) {
      strLang = strLang + 'usrlang=' + navigator.userLanguage
    } else {
      strLang = strLang + 'usrlang=' + 'undefined'
    }
    return 'l:' + hash(strLang)
  } catch (err) {
    return 'l:-1'
  }
}

// Fingerprint Java...
function fpJava () {
  'use strict'

  try {
    return 'j:' + (navigator.javaEnabled() ? 1 : 0)
  } catch (err) {
    return 'j:0'
  }
}

// Fingerprint form fields...
function fpFormFields () {
  'use strict'

  var strFormsInputsData = []
  var strFormsInPage = document.getElementsByTagName('form')
  var numOfForms = strFormsInPage.length

  strFormsInputsData.push('url=' + window.location.href)

  for (var i = 0; i < numOfForms; i = i + 1) {
    strFormsInputsData.push('FORM=' + strFormsInPage[i].name)
    var strInputsInForm = strFormsInPage[i].getElementsByTagName('input')
    var numOfInputs = strInputsInForm.length
    for (var j = 0; j < numOfInputs; j = j + 1) {
      if (strInputsInForm[j].type !== 'hidden') {
        strFormsInputsData.push('Input=' + strInputsInForm[j].name)
      }
    }
  }
  return 'ff:' + strFormsInputsData.join('|')
}

// Fingerprint font enumeration...
function fpFonts () {
  'use strict'

  try {
    var style = 'position: absolute; visibility: hidden; display: block !important'
    var fonts = ['Abadi MT Condensed Light', 'Adobe Fangsong Std', 'Adobe Hebrew', 'Adobe Ming Std', 'Agency FB', 'Aharoni', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Arab', 'Arabic Transparent', 'Arabic Typesetting', 'Arial Baltic', 'Arial Black', 'Arial CE', 'Arial CYR', 'Arial Greek', 'Arial TUR', 'Arial', 'Batang', 'BatangChe', 'Bauhaus 93', 'Bell MT', 'Bitstream Vera Serif', 'Bodoni MT', 'Bookman Old Style', 'Braggadocio', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Calibri Light', 'Calibri', 'Californian FB', 'Cambria Math', 'Cambria', 'Candara', 'Castellar', 'Casual', 'Centaur', 'Century Gothic', 'Chalkduster', 'Colonna MT', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate Gothic Light', 'Corbel', 'Cordia New', 'CordiaUPC', 'Courier New Baltic', 'Courier New CE', 'Courier New CYR', 'Courier New Greek', 'Courier New TUR', 'Courier New', 'DFKai-SB', 'DaunPenh', 'David', 'DejaVu LGC Sans Mono', 'Desdemona', 'DilleniaUPC', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Engravers MT', 'Eras Bold ITC', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'Eurostile', 'FangSong', 'Forte', 'FrankRuehl', 'Franklin Gothic Heavy', 'Franklin Gothic Medium', 'FreesiaUPC', 'French Script MT', 'Gabriola', 'Gautami', 'Georgia', 'Gigi', 'Gisha', 'Goudy Old Style', 'Gulim', 'GulimChe', 'GungSeo', 'Gungsuh', 'GungsuhChe', 'Haettenschweiler', 'Harrington', 'Hei S', 'HeiT', 'Heisei Kaku Gothic', 'Hiragino Sans GB', 'Impact', 'Informal Roman', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'KacstOne', 'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'Kino MT', 'KodchiangUPC', 'Kokila', 'Kozuka Gothic Pr6N', 'Lao UI', 'Latha', 'Leelawadee', 'Levenim MT', 'LilyUPC', 'Lohit Gujarati', 'Loma', 'Lucida Bright', 'Lucida Console', 'Lucida Fax', 'Lucida Sans Unicode', 'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS Reference Sans Serif', 'MS UI Gothic', 'MV Boli', 'Magneto', 'Malgun Gothic', 'Mangal', 'Marlett', 'Matura MT Script Capitals', 'Meiryo UI', 'Meiryo', 'Menlo', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU-ExtB', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'Miriam Fixed', 'Miriam', 'Mongolian Baiti', 'MoolBoran', 'NSimSun', 'Narkisim', 'News Gothic MT', 'Niagara Solid', 'Nyala', 'PMingLiU', 'PMingLiU-ExtB', 'Palace Script MT', 'Palatino Linotype', 'Papyrus', 'Perpetua', 'Plantagenet Cherokee', 'Playbill', 'Prelude Bold', 'Prelude Condensed Bold', 'Prelude Condensed Medium', 'Prelude Medium', 'PreludeCompressedWGL Black', 'PreludeCompressedWGL Bold', 'PreludeCompressedWGL Light', 'PreludeCompressedWGL Medium', 'PreludeCondensedWGL Black', 'PreludeCondensedWGL Bold', 'PreludeCondensedWGL Light', 'PreludeCondensedWGL Medium', 'PreludeWGL Black', 'PreludeWGL Bold', 'PreludeWGL Light', 'PreludeWGL Medium', 'Raavi', 'Rachana', 'Rockwell', 'Rod', 'Sakkal Majalla', 'Sawasdee', 'Script MT Bold', 'Segoe Print', 'Segoe Script', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Segoe UI', 'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'SimHei', 'SimSun', 'SimSun-ExtB', 'Simplified Arabic Fixed', 'Simplified Arabic', 'Snap ITC', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman Baltic', 'Times New Roman CE', 'Times New Roman CYR', 'Times New Roman Greek', 'Times New Roman TUR', 'Times New Roman', 'TlwgMono', 'Traditional Arabic', 'Trebuchet MS', 'Tunga', 'Tw Cen MT Condensed Extra Bold', 'Ubuntu', 'Umpush', 'Univers', 'Utopia', 'Utsaah', 'Vani', 'Verdana', 'Vijaya', 'Vladimir Script', 'Vrinda', 'Webdings', 'Wide Latin', 'Wingdings']
    var count = fonts.length
    var template = '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',sans-serif !important">wwmmllii</b>' + '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',monospace !important">wwmmllii</b>'
    var fragment = document.createDocumentFragment()
    var divs = []
    for (var i = 0; i < count; i++) {
      var font = fonts[i]
      var div = document.createElement('div')
      font = font.replace(/['"<>]/g, '')
      div.innerHTML = template.replace(/X/g, font)
      div.style.cssText = style
      fragment.appendChild(div)
      divs.push(div)
    }
    var body = document.body
    body.insertBefore(fragment, body.firstChild)
    var result = []
    for (i = 0; i < count; i = i + 1) {
      var e = divs[i].getElementsByTagName('b')
      if (e[0].offsetWidth === e[1].offsetWidth) {
        result.push(fonts[i])
      }
    }
    // do not combine these two loops, remove child will cause reflow
    // and induce severe performance hit
    for (i = 0; i < count; i = i + 1) {
      body.removeChild(divs[i])
    }
    return 'f:' + hash(result.join('|'))
  } catch (err) {
    return 'f:-1'
  }
}

// Fingerprint display...
function fpDisplay () {
  'use strict'

  try {
    var strScreen = window.screen
    if (strScreen) {
      var strDisplay = strScreen.width + '|' + strScreen.height + '|' + strScreen.availWidth + '|' + strScreen.availHeight + '|' + strScreen.colorDepth
    }
    return 'd:' + strDisplay
  } catch (err) {
    return 'd:-1'
  }
}

// Flash
function fpFlash () {
  'use strict'

  try {
    var objPlayerVersion = swfobject.getFlashPlayerVersion()
    var strVersion = objPlayerVersion.major + '.' + objPlayerVersion.minor + '.' + objPlayerVersion.release
    if (strVersion === '0.0.0') {
      strVersion = 'N/A'
    }
    return 'fl:' + strVersion
  } catch (err) {
    return 'fl:-1'
  }
}
