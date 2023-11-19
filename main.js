//© 2023, Jonas Ploth. Alle Rechte vorbehalten.
//In keinem Fall sind die Autoren oder Urheberrechtsinhaber haftbar für irgendwelche Ansprüche, Schäden oder andere Verbindlichkeiten, 
//die im Zusammenhang mit dem Software-Code oder dessen Nutzung oder anderen Handlungen im Zusammenhang damit stehen.
//Die Nutzung, Vervielfältigung, Modifikation, Verbreitung oder Weitergabe dieses Codes oder Teile davon ist ohne 
//die ausdrückliche schriftliche Genehmigung des Urheberrechtsinhabers strengstens untersagt.



function main() {
  var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/19ppXZ5zGwv75mukoU-6_xK1H5XEOR2cUymXsDDG1TYo/'; // Spreadsheet URL
  var campaignId = '18459565600'; // Kampagnen-ID
  var sheet = SpreadsheetApp.openByUrl(spreadsheetUrl).getActiveSheet();

   // Überschriften setzen
  sheet.appendRow(['Suchbegriff', 'Kosten', 'Conversions']);

  // Berechnung des Datumsbereichs für die letzten 90 Tage
  var endDate = new Date();
  var startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);
  
  var formattedStartDate = Utilities.formatDate(startDate, "PST", "yyyyMMdd");
  var formattedEndDate = Utilities.formatDate(endDate, "PST", "yyyyMMdd");

  var query = "SELECT CampaignId, Query, Cost, Conversions " +
              "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
              "WHERE CampaignId = '" + campaignId + "' " +
              "AND Conversions = 0 " +
              "AND Cost > 30000000 " + // Kosten in Mikroeinheiten
              "DURING " + formattedStartDate + "," + formattedEndDate;

  var report = AdsApp.report(query);
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var query = row['Query'];
    var cost = parseFloat(row['Cost']); // Umrechnung von Mikroeinheiten in Euro
    var conversions = row['Conversions'];
    sheet.appendRow([query, cost, conversions]);
  }
}
