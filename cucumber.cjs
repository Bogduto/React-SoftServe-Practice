module.exports = {
  default: {
    require: ["src/tests/e2e/steps/**/*.js", "src/tests/e2e/support/**/*.js",],
    paths: ["src/tests/e2e/features/**/*.feature"],
  },
};
