let dbData = [];

// CSVをパースする簡易関数
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  const data = [];
  for(let i=1; i<lines.length; i++){
    const row = lines[i].split(",");
    let obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = row[idx] ? row[idx].trim() : "";
    });
    data.push(obj);
  }
  return data;
}

// ページロード時に mapping_DB.csv を取得
window.addEventListener("load", () => {
  fetch("mapping_DB.csv")
    .then(resp => resp.text())
    .then(csvText => {
      dbData = parseCSV(csvText);
      console.log("DB CSV loaded. count =", dbData.length);
    })
    .catch(err => {
      console.error("CSV読み込み失敗:", err);
      document.getElementById("results").textContent = "CSVを読み込めませんでした。";
    });
});

function searchDB(){
  const kw = document.getElementById("keyword").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if(!kw){
    resultsDiv.textContent = "キーワードが空です。";
    return;
  }

  // SectionTitle2 や Remarksに部分一致検索する例
  const matched = dbData.filter(item => {
    const st2 = (item.SectionTitle2 || "").toLowerCase();
    const remarks = (item.Remarks || "").toLowerCase();
    return st2.includes(kw) || remarks.includes(kw);
  });

  if(matched.length === 0){
    resultsDiv.textContent = "該当なし";
    return;
  }

  matched.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `
      <hr/>
      <b>DocName:</b> ${r.DocName}<br/>
      <b>GuideNameJp:</b> ${r.GuideNameJp}<br/>
      <b>SectionTitle1:</b> ${r.SectionTitle1}<br/>
      <b>SectionTitle2:</b> ${r.SectionTitle2}<br/>
      <b>PageNumber:</b> ${r.PageNumber}<br/>
      <a href="${r.FullLink}" target="_blank">リンク(FullLink)を開く</a><br/>
      <b>Remarks:</b> ${r.Remarks}
    `;
    resultsDiv.appendChild(div);
  });
}
