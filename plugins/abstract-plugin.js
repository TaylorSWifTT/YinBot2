class AbstractPlugin {
  getDescription() {
    return false;
  }

  getHelp(args) {
    return 'No in-depth help provided for this plugin';
  }
}

module.exports = AbstractPlugin;
