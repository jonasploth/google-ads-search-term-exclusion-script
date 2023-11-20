//© 2023, Jonas Ploth . Alle Rechte vorbehalten.
//In keinem Fall sind die Autoren oder Urheberrechtsinhaber haftbar für irgendwelche Ansprüche, Schäden oder andere Verbindlichkeiten, 
//die im Zusammenhang mit dem Software-Code oder dessen Nutzung oder anderen Handlungen im Zusammenhang damit stehen.
//Die Nutzung, Vervielfältigung, Modifikation, Verbreitung oder Weitergabe dieses Codes oder Teile davon ist ohne 
//die ausdrückliche schriftliche Genehmigung des Urheberrechtsinhabers strengstens untersagt.

function main() {
  var spreadsheetUrl = 'IHR_SPREADSHEET_URL'; // Ersetzen Sie dies durch die URL Ihres Google Sheets
  var campaignId = 'IHRE_KAMPAGNEN_ID'; // Ersetzen Sie dies durch Ihre CampaignID
  var costThreshold = 50000000; // Kosten in Mikroeinheiten (€50 = 50,000,000)
  var daysAgo = 90; // Anzahl der Tage für den Zeitraum
  var createAndExclude = 'YES'; // Setzen Sie dies auf 'YES' oder 'NO'

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
  var exclusionList = [];

  while (rows.hasNext()) {
    var row = rows.next();
    var searchTerm = row['Query'];
    var cost = parseFloat(row['Cost']) / 1000000;
    var conversions = row['Conversions'];
    sheet.appendRow([searchTerm, cost, conversions]);

    if (createAndExclude === 'YES') {
      exclusionList.push(searchTerm);
    }
  }

  if (createAndExclude === 'YES' && exclusionList.length > 0) {
    addKeywordsToExclusionList(campaignId, exclusionList);
  }
}

function addKeywordsToExclusionList(campaignId, keywords) {
  var campaign = AdsApp.campaigns().withIds([campaignId]).get().next();
  var negativeKeywordList = AdsApp.newNegativeKeywordListBuilder()
      .withName('Exclusion List for Campaign ' + campaignId)
      .build()
      .getResult();

  for (var i = 0; i < keywords.length; i++) {
    negativeKeywordList.addNegativeKeyword(keywords[i]);
  }

  campaign.addNegativeKeywordList(negativeKeywordList);
}
