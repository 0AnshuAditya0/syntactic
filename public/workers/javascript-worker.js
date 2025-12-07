// JavaScript execution worker
self.onmessage = function(e) {
  const { code, id } = e.data;
  
  const logs = [];
  const errors = [];
  
  // Override console.log to capture output
  const console = {
    log: (...args) => {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' '));
    },
    error: (...args) => {
      errors.push(args.map(arg => String(arg)).join(' '));
    },
    warn: (...args) => {
      logs.push('[WARN] ' + args.map(arg => String(arg)).join(' '));
    },
  };
  
  try {
    // Execute code in isolated context
    const func = new Function('console', code);
    func(console);
    
    self.postMessage({
      id,
      success: true,
      output: logs.join('\n'),
      errors: errors.join('\n'),
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      output: logs.join('\n'),
      error: error.message,
      stack: error.stack,
    });
  }
};
