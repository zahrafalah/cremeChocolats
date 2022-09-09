require("@babel/register")({
  extends: "./.node.babelrc",
  extensions: [".js", ".jsx", ".ts", ".tsx"],
});
require("./devApiServer");
