module.exports = {
  rollup(config) {
    if (config.output.format === 'umd') {
      config.external = () => false
    }
    return config
  },
}
