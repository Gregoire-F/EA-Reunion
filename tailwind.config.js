module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/daisyui/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
};
