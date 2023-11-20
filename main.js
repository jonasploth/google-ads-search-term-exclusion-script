//© 2023, Jonas Ploth . Alle Rechte vorbehalten.
//In keinem Fall sind die Autoren oder Urheberrechtsinhaber haftbar für irgendwelche Ansprüche, Schäden oder andere Verbindlichkeiten, 
//die im Zusammenhang mit dem Software-Code oder dessen Nutzung oder anderen Handlungen im Zusammenhang damit stehen.
//Die Nutzung, Vervielfältigung, Modifikation, Verbreitung oder Weitergabe dieses Codes oder Teile davon ist ohne 
//die ausdrückliche schriftliche Genehmigung des Urheberrechtsinhabers strengstens untersagt.


function main() {
  // Configuration Section
  var spreadsheetUrl = 'YOUR_SPREADSHEET_URL'; // Replace with the URL of your Google Sheet
  var campaignIds = ['CAMPAIGN_ID_1', 'CAMPAIGN_ID_2', 'CAMPAIGN_ID_3']; // Add campaign IDs as an array
  var costThreshold = 50000000; // Cost threshold in micro-units (€50 = 50,000,000)
  var daysAgo = 90; // Number of days for the time period
  var createAndExclude = 'NO'; // Set to 'YES' or 'NO'

  // DO NOT TOUCH CODE BELOW HERE

  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var today = Utilities.formatDate(new Date(), "GMT", "yyyyMMdd");
  var sheetName = "Scan on " + today;
  var sheet = spreadsheet.getSheetByName(sheetName);

  // Create a new sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(['Campaign Name', 'Search Term', 'Cost', 'Conversions']);
  }

  var endDate = new Date();
  var startDate = new Date();
  startDate.setDate(endDate.getDate() - daysAgo);
  
  var formattedStartDate = Utilities.formatDate(startDate, "PST", "yyyyMMdd");
  var formattedEndDate = Utilities.formatDate(endDate, "PST", "yyyyMMdd");

  for (var i = 0; i < campaignIds.length; i++) {
    var campaignId = campaignIds[i];
    var campaignName = getCampaignNameById(campaignId); // Fetch the campaign name

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
      var cost = parseFloat(row['Cost']) / 1000000; // Convert cost from micro-units to Euros
      var conversions = row['Conversions'];
      sheet.appendRow([campaignName, searchTerm, cost, conversions]);

      if (createAndExclude === 'YES') {
        exclusionList.push(searchTerm);
      }
    }

    if (createAndExclude === 'YES' && exclusionList.length > 0) {
      addKeywordsToExclusionList(campaignId, exclusionList);
    }
  }
}

function getCampaignNameById(campaignId) {
  var campaignIterator = AdsApp.campaigns()
                          .withIds([campaignId])
                          .get();
  if (campaignIterator.hasNext()) {
    return campaignIterator.next().getName();
  }
  return 'Unknown Campaign'; // Default name if the campaign is not found
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
