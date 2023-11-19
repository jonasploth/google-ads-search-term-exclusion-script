//© 2023, Jonas Ploth. Alle Rechte vorbehalten.
//In keinem Fall sind die Autoren oder Urheberrechtsinhaber haftbar für irgendwelche Ansprüche, Schäden oder andere Verbindlichkeiten, 
//die im Zusammenhang mit dem Software-Code oder dessen Nutzung oder anderen Handlungen im Zusammenhang damit stehen.
//Die Nutzung, Vervielfältigung, Modifikation, Verbreitung oder Weitergabe dieses Codes oder Teile davon ist ohne 
//die ausdrückliche schriftliche Genehmigung des Urheberrechtsinhabers strengstens untersagt.


function main() {
  var spreadsheetUrl = 'YOUR_SPREADSHEET_URL'; // Replace with your Spreadsheet URL
  var campaignId = 'YOUR_CAMPAIGN_ID'; // Replace with campaign id
  var costThreshold = 50000000; // Cost in Microunits (€50 = 50,000,000)
  var daysAgo = 90; //How many Days to count backwards in report

  var sheet = SpreadsheetApp.openByUrl(spreadsheetUrl).getActiveSheet();
  sheet.appendRow(['Suchbegriff', 'Kosten', 'Conversions']);

  var endDate = new Date();
  var startDate = new Date();
  startDate.setDate(endDate.getDate() - daysAgo);
  
  var formattedStartDate = Utilities.formatDate(startDate, "PST", "yyyyMMdd");
  var formattedEndDate = Utilities.formatDate(endDate, "PST", "yyyyMMdd");

  var query = "SELECT CampaignId, Query, Cost, Conversions " +
              "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
              "WHERE CampaignId = '" + campaignId + "' " +
              "AND Conversions = 0 " +
              "AND Cost > " + costThreshold + " " +
              "DURING " + formattedStartDate + "," + formattedEndDate;

  var report = AdsApp.report(query);
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var query = row['Query'];
    var cost = parseFloat(row['Cost']); 
    var conversions = row['Conversions'];
    sheet.appendRow([query, cost, conversions]);
  }
}
