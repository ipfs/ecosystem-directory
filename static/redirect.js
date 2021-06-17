function addScript(src) {
  const s = document.createElement('script')
  s.setAttribute('src', src)
  document.body.appendChild(s)
}

setTimeout(() => {
  const ipfsPathRegExp = /^(\/(?:ipfs|ipns)\/[^/]+)/
  const ipfsPathPrefix = (window.location.pathname.match(ipfsPathRegExp) || [])[1] || ''
  if (ipfsPathPrefix) {
    const scripts = [...document.getElementsByTagName('script')]

    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src) {
        const source = new URL(scripts[i].src)
        if (source.pathname.includes('redirect.js')) {
          console.log('skip redirect')
          continue
        }
        console.log('Loading', source.pathname)
        const newSource = window.location.href.slice(0, -1) + source.pathname
        addScript(newSource)
      }
    }
    console.log('Finished')
  }
}, 10000)
