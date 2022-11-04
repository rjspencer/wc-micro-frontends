
const routes = {
  '': {
    script: '/components/home.js',
    tag: '<home-component />'
  },
  about: {
    script: '/components/about.js',
    tag: '<about-component />'
  },
  checklist: {
    script: 'https://rjspencer.github.io/r2wc-checklist/static/js/main.js',
    tag: '<r2wc-checklist items=\'[{"label":"First Thing","isChecked":false}]\' />'
  }
};

function createRouter(basePath) {
  let currentPath = null;
  let root = document.getElementById('root');
  
  function addScript(src) {
    // maybe tracking loaded scripts in memory would be quicker? maybe on a much bigger DOM it matters?
    // this is incredibly fast though, and simple... see benchmark at end of file
    // running 1000 iterations of the next 2 lines on a real client site took 4ms
    const allScripts = document.getElementsByTagName('script');
    const alreadyLoaded = [...allScripts].some(script => script.src === src)
    if (alreadyLoaded) return 
    
    const tag = document.createElement('script');
    tag.src = src;
    const head = document.getElementsByTagName('body')[0];
    head.appendChild(tag);
  }

  function resolveRoute(route) {
    try {
      return routes[route];
    } catch (e) {
      throw new Error(`Route ${route} not found`);
    };
  };
  
  function routeTo(newPath) {
    if (!root) return;
    if (newPath === currentPath) return;
    
    const route = resolveRoute(newPath);
    if (!route) return;

    if (typeof route === 'object') { 
      currentPath = newPath;
      window.history.pushState({}, '', basePath + '/' + newPath)
      if (route.script) {
        if (/http(s)?:\/\//.test(route.script)) {
          addScript(route.script)
        } else {
          addScript(basePath + '/' + route.script)
        }
      }
      root.innerHTML = route.tag 
    } else {
      currentPath = newPath;
      window.history.pushState({}, '', basePath + '/' + newPath)
      root.replaceChildren(route(routeTo))
    }
  }
  
  function onLoad() {
    const newPath = window.location.pathname.replace(basePath, '').split('/')[1]
    routeTo(newPath)
  }

  return onLoad
};

const router = createRouter('/wc-micro-frontends')
window.addEventListener('load', router);

// function benchmark(fn, iterations = 1000) {
//   const start = Date.now()
//   let i = 0
//   for(i; i < iterations; i++) {
//     fn()
//   }
//   const end = Date.now()

//   console.log(`
//     Start: ${start}
//     End: ${end}
//     Iterations: ${iterations}
//     Time Elapsed (ms): ${end-start}
//   `)
// }

// benchmark(() => {
//   const allScripts = document.getElementsByTagName('script');
//   return [...allScripts].some(script => script.src === '')
// }, 1000)