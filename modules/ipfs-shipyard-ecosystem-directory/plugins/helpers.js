// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Filesize = require('filesize')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ========================================================== SetProjectDefaults
const SetProjectDefaults = (store) => (project) => {
  const projectSchema = store.getters['global/siteContent']['project-schema']
  const check = (schema, field) => {
    for (const key in schema) {
      if (field.hasOwnProperty(key)) {
        const schemaValue = schema[key]
        const fieldValue = field[key]
        const schemaType = typeof schemaValue
        const fieldType = typeof fieldValue
        // Check for: booleans, strings, empty string values, and numbers
        if ((fieldValue === '') || // empty string value
            (schemaValue === 'boolean' && fieldType !== 'boolean') || // booleans
            (schemaValue === 'string' && fieldType !== 'string') || // strings
            (schemaValue === 'number' && fieldType !== 'number' && fieldValue === Number(fieldValue) && !Number.isFinite(fieldValue))) { // numbers
          field[key] = null
        // Check for: array and associative array
        } else if (schemaType === 'object' && fieldType === 'object') {
          if (!Array.isArray(fieldValue)) { // associative array
            check(schemaValue, fieldValue)
          } else { // regular array
            if (fieldValue.length === 0) { // empty array
              field[key] = null
            } else {
              fieldValue.forEach((item) => {
                if (item !== null && typeof item === 'object' && !Array.isArray(item)) { // array of objects
                  check(schemaValue[0], item)
                }
              })
            }
          }
        }
      } else {
        field[key] = null
      }
    }
  }; check(projectSchema, project)
  return project
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
const methods = module.exports = ({ store, app }, inject) => {
  // /////////////////////////////////////////////////////////////////// Slugify
  // ----------------------- Options: 'dash', 'underscore', 'underscore-no-trim'
  inject('slugify', (text, type = 'dash') => {
    if (type === 'dash') {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    } else if (type === 'underscore') {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '_') // Replace spaces with _
        .replace(/[^\w_]+/g, '') // Remove all non-word chars
        .replace(/__+/g, '_') // Replace multiple _ with single _
        .replace(/^_+/, '') // Trim _ from start of text
        .replace(/_+$/, '') // Trim _ from end of text
    } else if (type === 'underscore-no-trim') {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '_') // Replace spaces with _
        .replace(/[^\w_]+/g, '') // Remove all non-word chars
        .replace(/__+/g, '_') // Replace multiple _ with single _
    } else {
      return 'Incompatible "Type" specified. Must be type "dash", "underscore", or "underscore-no-trim". Default is "dash"'
    }
  })
  // /////////////////////////////////////////////////////////////// Parse a URL
  // ----------------- https://www.abeautifulsite.net/parsing-urls-in-javascript
  inject('parseURL', (url) => {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    const urlBreakdown = {}
    let hostname = null
    let domain = null
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      hostname = match[2]
    }
    const urlParts = hostname.split('.').reverse()
    if (urlParts != null && urlParts.length > 1) {
      domain = urlParts[1] + '.' + urlParts[0]
      if (hostname.toLowerCase().includes('.co.uk') !== -1 && urlParts.length > 2) {
        domain = urlParts[2] + '.' + domain
      }
    }
    urlBreakdown.hostname = hostname
    urlBreakdown.domain = domain
    return urlBreakdown
  })
  // ////////////////////////////////////////////////////// Throttle From Lodash
  // ---------------------------------------------------------------------------
  inject('throttle', (func, wait, options) => {
    let context
    let args
    let result
    let timeout = null
    let previous = 0
    if (!options) { options = {} }
    const later = function () {
      previous = options.leading === false ? 0 : Date.now()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) { context = args = null }
    }
    return function () {
      const now = Date.now()
      if (!previous && options.leading === false) { previous = now }
      const remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        if (timeout) { clearTimeout(timeout); timeout = null }
        previous = now
        result = func.apply(context, args)
        if (!timeout) { context = args = null }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      } return result
    }
  })
  // ///////////////////////////////////////// Check if Element contains a class
  // ---------------------------------------------------------------------------
  inject('hasClass', (element, className) => {
    if (element.classList) { return element.classList.contains(className) }
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)
  })
  // ///////////////////////////////////////////// If on iOS, return the version
  // ----------------------- supports iOS 2.0 and later -- https://bit.ly/TJjs1V
  inject('iOSversion', (element, className) => {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
    }
    return false
  })
  // ////////////////////////////// Add class to NodeList staggered sequentially
  // ---------------------------------------------------------------------------
  inject('staggeredAddClass', (elements, className, offset, next) => {
    const len = elements.length - 1
    let num = 0
    const interval = setInterval(() => {
      const item = elements[num] ? elements[num].$el || elements[num] : null
      if (!item) {
        clearInterval(interval)
        if (next) { return next() }
      } else {
        item.classList.add(className)
      }
      if (num === len) {
        clearInterval(interval)
        if (next) { return next() }
      }
      num++
    }, offset)
  })
  // ////////////////// Get the time from a timestamp in "22 seconds ago" format
  // ---------------------------------------------------------------------------
  inject('timeago', (timestamp) => {
    const now = new Date()
    const secondsPast = (now.getTime() - timestamp.getTime()) / 1000
    if (secondsPast === 1) { return Math.floor(parseInt(secondsPast)) + ' second ago' }
    if (secondsPast < 60) { return Math.floor(parseInt(secondsPast)) + ' seconds ago' }
    if (secondsPast === 60) { return Math.floor(parseInt(secondsPast / 60)) + ' minute ago' }
    if (secondsPast < 3600) { return Math.floor(parseInt(secondsPast / 60)) + ' minutes ago' }
    if (secondsPast === 3600) { return Math.floor(parseInt(secondsPast / 3600)) + ' hour ago' }
    if (secondsPast < 86400) { return Math.floor(parseInt(secondsPast / 3600)) + ' hours ago' }
    if (secondsPast < 172800) { return Math.floor(parseInt(secondsPast / 86400)) + ' day ago' }
    if (secondsPast > 86400) { return Math.floor(parseInt(secondsPast / 86400)) + ' days ago' }
    return timestamp
  })
  // /////////////////////////////////////////////////////////// Parse Video URL
  // ---------------------------------- https://gist.github.com/yangshun/9892961
  inject('parseVideoUrl', (url) => {
    const matched = url.match(/(https?:\/\/|\/\/|)(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/)
    if (!matched) { return { type: false, id: false, time: false } }
    const parsed = new URL(`https://placeholder-for-parsing.com/${url.split('/').pop()}`)
    const domain = matched[3]
    let type = ''
    if (domain.includes('youtu')) { type = 'youtube' }
    if (domain.includes('vimeo')) { type = 'vimeo' }
    if (domain.includes('dailymotion')) { type = 'dailymotion' }
    return { type, id: matched[6], time: parsed.searchParams.get('t') }
  })
  // ///////////////////////////////////////////////////// Generate an embed URL
  // ---------------------------------------------------------- Youtube or Vimeo
  inject('buildVideoEmbedUrl', (parsed) => {
    const type = parsed.type
    const id = parsed.id
    const time = parsed.time
    let url
    switch (type) {
      case 'youtube' : url = `//www.youtube.com/embed/${id}${(time ? `?start=${time}` : '')}`; break
      case 'vimeo' : url = `//player.vimeo.com/video/${id}${(time ? `/#=${time}` : '')}`; break
      default : url = false
    }
    return url
  })
  // //////////////////////////////// Get the height of the entire page Document
  // ---------------------------------------------------------------------------
  inject('getDocHeight', () => {
    const D = document
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    )
  })
  // /////////////////////////////// Capitalize first letters of words in string
  // ---------------------------------------------------------------------------
  /**
    * Capitalizes .
    * @param {string} str String to be modified
    * @param {boolean=false} lower Whether all other letters should be lowercased
    * @return {string}
    * @usage
    *   capitalize('fix this string')     // -> 'Fix This String'
    *   capitalize('javaSCrIPT')          // -> 'JavaSCrIPT'
    *   capitalize('javaSCrIPT', true)    // -> 'Javascript'
    */
  inject('capitalize', (str, lower = false) => {
    return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
  })
  // //////////////////////////////////// Convert bytes to human-readable format
  // --------------------------- Ex: 257831078666960800 bytes outputs as 229 PiB
  inject('formatBytes', (bytes, format = 'string') => {
    const size = Filesize(bytes, { standard: 'iec' })
    if (format === 'string') { return size }
    const split = size.split(' ')
    return { value: split[0], unit: split[1] }
  })
  // /////////////////////////////////////////////// Get SEO and Open Graph data
  // --------------------------- Return global SEO if no identifier is specified
  inject('getSeo', (identifier = 'general') => {
    const siteContent = store.getters['global/siteContent']
    let data = siteContent[identifier]
    if (!data) { data = siteContent.general }
    const seo = data.seo
    const og = data.og
    return {
      title: seo.title,
      description: seo.description,
      og_site_name: og.site_name,
      og_url: og.url,
      og_type: og.type,
      og_image: og.image
    }
  })
  // ////////////////////////////////////////////////////////// Shuffle an Array
  // --------------------------------------- https://stackoverflow.com/a/2450976
  inject('shuffleArray', (arr) => {
    let currentIndex = arr.length
    let temporaryValue
    let randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = arr[currentIndex]
      arr[currentIndex] = arr[randomIndex]
      arr[randomIndex] = temporaryValue
    }
    return arr
  })
  // ////////////////////////////////// Generate a Random Integer Within a Range
  // --------------------------------------- https://stackoverflow.com/a/1527820
  inject('getRandomInteger', (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  })
  // ///////////////////////////////////////////////////////// Truncate a string
  // -------------------------------------------- Default: len = 30, end = '...'
  inject('truncateString', (string, len = 30, delimiter = '...', type = 'single', endLen = 8) => {
    if (!string) { return string }
    let stringLen = len + delimiter.length
    if (type === 'double') {
      stringLen += endLen
      return string.length > stringLen ? `${string.slice(0, len)}${delimiter}${string.slice(-endLen)}` : string
    } else {
      return string.length > stringLen ? `${string.slice(0, len)}${delimiter}` : string
    }
  })
  // ////////////////////////////////////////////// Convert number to have zeros
  // -------------------------------------- Ex: 250 --> 250.00, 250.1 --> 250.10
  inject('formatNumberWithZeros', (incoming) => {
    const value = typeof incoming !== 'number' ? parseFloat(incoming) : incoming
    if (isNaN(value)) { return value }
    const split = value.toString().split('.')
    const beforeDecimal = split[0]
    const afterDecimal = split[1]
    const beforeLen = beforeDecimal.length
    if (beforeLen === 1) {
      return Number(`${beforeDecimal}${afterDecimal ? `.${afterDecimal.charAt(0)}` : ''}`).toFixed(1)
    } else if (beforeLen > 1) {
      return value.toFixed(2)
    } else {
      return value
    }
  })
  // ///////////////////////////////////////////////////// Add text to clipboard
  // ---------------------------------------------------------------------------
  inject('addTextToClipboard', (text) => {
    const container = document.createElement('textarea')
    container.style.position = 'fixed'
    container.style.left = '-99999px'
    container.style.zIndex = '-1'
    container.style.opacity = '0'
    container.style.pointerEvents = 'none'
    container.innerHTML = text
    document.body.appendChild(container)
    container.select()
    document.execCommand('copy')
    document.body.removeChild(container)
  })
  // ////////////////////////////////////// Set default project JSON file values
  // ---------------------------------------------------------------------------
  /*
   * Checking for:
   *  - special: isArray, Number(), Number.isFinite()
   *  - typeof: object, string, boolean
   *  - empty strings, empty arrays
   */
  inject('setProjectDefaults', SetProjectDefaults(store))
}

methods.SetProjectDefaults = SetProjectDefaults
