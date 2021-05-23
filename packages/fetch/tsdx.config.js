// https://github.com/formium/tsdx/issues/179#issuecomment-605502952
module.exports = {
  rollup(config) {
    if (config.output.format === 'umd') {
      config.external = () => false
    }
    return config
  },
}
