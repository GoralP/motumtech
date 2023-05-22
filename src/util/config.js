var d = new Date();
var n = d.getFullYear();

let hostingURL = window.location.hostname;
const branch = window.location.pathname.split("/")[1];
console.log("branch---->", branch);
module.exports = {
  footerText: "Copyright Motum © " + n,
  // baseURL:
  //   hostingURL === "www.motumquod.com"
  //     ? "https://www.motumquod.com/Motum/api/"
  //     : hostingURL === "www.motumlabs.com"
  //     ? "https://www.motumlabs.com/Motum/api/"
  //     : hostingURL === "motum.estabanell.cat"
  //     ? "https://motum.estabanell.cat/Motum/api/"
  //     : "https://www.motumlabs.com/Motum/api/",
  baseURL:
    hostingURL === "www.motumquod.com"
      ? "https://www.motumquod.com/Motum/api/"
      : hostingURL === "www.motumlabs.com"
      ? "https://www.motumquod.com/Motum/api/"
      : hostingURL === "motum.estabanell.cat"
      ? "https://motum.estabanell.cat/Motum/api/"
      : "https://www.motumquod.com/Motum/api/",
  webURL: branch + "/",
  hostURL:
    hostingURL === "localhost"
      ? "http://localhost:3000"
      : "https://" + hostingURL,
  deskoURL:
    hostingURL === "localhost"
      ? "http://localhost:8080/"
      : "http://localhost:8080/",
  branchName: branch,
};
