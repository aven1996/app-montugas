function getTargetSheet() {
  // Ganti "DataRevisi" sesuai nama tab yang Anda pakai agar tidak salah tab
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DataRevisi") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function doGet(e) {
  var sheet = getTargetSheet();
  var rows = sheet.getDataRange().getValues();
  var data = [];
  
  for (var i = 1; i < rows.length; i++) {
    var id = String(rows[i][0] || "").trim();
    var nama = String(rows[i][1] || "").trim();
    var kelas = String(rows[i][2] || "").trim();
    var revisi = String(rows[i][3] || "").trim();
    var status = String(rows[i][4] || "Belum").trim();
    var nilai1 = rows[i][5] !== "" ? Number(rows[i][5]) : "";
    var nilai2 = rows[i][6] !== "" ? Number(rows[i][6]) : "";
    var nilai3 = rows[i][7] !== "" ? Number(rows[i][7]) : "";
    var rataRata = rows[i][8] !== "" ? Number(rows[i][8]) : "";
    
    if (nama !== "") {
      data.push({
        id: id || ("REV-" + i),
        nama: nama,
        kelas: kelas,
        revisi: revisi,
        status: status,
        nilai1: nilai1,
        nilai2: nilai2,
        nilai3: nilai3,
        rataRata: rataRata
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = getTargetSheet();
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  
  // 1. Tambah Revisi
  if (action === "ADD") {
    var newId = "REV-" + new Date().getTime();
    sheet.appendRow([newId, params.nama, params.kelas, params.revisi, "Belum", params.nilai1 || "", params.nilai2 || "", params.nilai3 || "", params.rataRata || ""]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, id: newId }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. Centang Selesai / Belum
  if (action === "TOGGLE_STATUS") {
    var targetId = String(params.id);
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === targetId) {
        var currentStatus = String(rows[i][4]);
        var nextStatus = (currentStatus.toLowerCase() === "selesai") ? "Belum" : "Selesai";
        sheet.getRange(i + 1, 5).setValue(nextStatus);
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  // 3. Hapus Revisi
  if (action === "DELETE") {
    var targetId = String(params.id);
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === targetId) {
        sheet.deleteRow(i + 1);
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // 4. Simpan Nilai Guru (Satu kali tembak 4 kolom sekaligus)
  if (action === "UPDATE_SCORES") {
    var targetNama = String(params.nama).trim();
    var targetKelas = params.kelas ? String(params.kelas).trim() : null;
    var rows = sheet.getDataRange().getValues();
    var newScores = [params.nilai1, params.nilai2, params.nilai3, params.rataRata];

    for (var i = 1; i < rows.length; i++) {
      var matchNama = String(rows[i][1]).trim() === targetNama;
      var matchKelas = targetKelas ? String(rows[i][2]).trim() === targetKelas : true;
      
      if (matchNama && matchKelas) {
        // Menulis langsung 4 kolom (kolom F s/d I) dalam 1 panggilan API
        sheet.getRange(i + 1, 6, 1, 4).setValues([newScores]);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false }))
    .setMimeType(ContentService.MimeType.JSON);
}
