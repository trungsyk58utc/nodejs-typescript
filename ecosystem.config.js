module.exports = [
  {
    script: 'dist/index.js',
    name: 'index',
    exec_mode: 'cluster',
    instances: 2
  },
  {
    script: 'dist/worker/tokenProcessor.js',
    name: 'token-processor',
    exec_mode: 'cluster',
  }
]
