let app = new Vue({
  el: "#app",
  data: {
    viewQR: false,
    generatedQR: "",
    editTargetId: 0
  },
  methods: {
    createQR(jukeid) {
      let e = "https://projetjukebox.herokuapp.com/" + jukeid;
      this.viewQR = true;
      this.generatedQR = e;
      document.getElementById("qrcode-container").innerHTML = "";
      let qrcode = new QRCode(document.getElementById("qrcode-container"));
      qrcode.makeCode(e.toString());
    },

    leaveQR() {
      this.viewQR = false;
    }
  }
});
