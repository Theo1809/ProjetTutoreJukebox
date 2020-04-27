let app = new Vue({
  el: "#app",
  data: {
    viewQR: false,
    generatedQR: "",
    editTargetId: 0
  },
  methods: {
    createQR(fleurID) {
      this.viewQR = true;
      this.generatedQR = fleurID;
      document.getElementById("qrcode-container").innerHTML = "";
      let qrcode = new QRCode(document.getElementById("qrcode-container"));
      qrcode.makeCode(fleurID.toString());
    },

    leaveQR() {
      this.viewQR = false;
    }
  }
});
