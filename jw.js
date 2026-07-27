self.addEventListener("install", (event) => {
  console.log("SWインストール");
});

self.addEventListener("activate", (event) => {
  console.log("SW有効化");
});
