//© 2023, Jonas Ploth. All rights reserved.
//In no event shall the authors or copyright holders be liable for any claims, damages, or other liabilities,
//arising from or in connection with the software code or its use or other dealings in the software.
//The use, duplication, modification, distribution, or dissemination of this code or parts thereof is strictly prohibited without
//the express written permission of the copyright holder.


function main() {
  
  // Configuration Section
  var spreadsheetUrl = 'YOUR_SPREADSHEET_URL'; // Replace with the URL of your Google Sheet
  var campaignIds = ['CAMPAIGN_ID_1', 'CAMPAIGN_ID_2', 'CAMPAIGN_ID_3']; // Add campaign IDs 
  var costThresholdInEuros = 50; // Cost threshold in Euros (e.g., €50)
  var daysAgo = 90; // Number of days for the time period
  var createAndExclude = 'NO'; // Set to 'YES' or 'NO'
  var notificationEmail = 'YOUR_EMAIL_ADDRESS'; // Set the email address for notifications
  var emailSubject = 'Google Ads Script Report Completed'; // Customize the email subject
  var emailBody = 'The report for your Google Ads campaigns has been completed.\n\n' +
                  'You can view the report at: ' + spreadsheetUrl; // Customize the email body
  // Configuration Section
  
  // Convert cost threshold to micro-units
  var costThreshold = costThresholdInEuros * 1000000;
  var excludedKeywordsInfo = []; // To keep track of excluded keywords

  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var today = Utilities.formatDate(new Date(), "GMT", "yyyyMMdd");
  var sheetName = "Scan on " + today;
  var sheet = spreadsheet.getSheetByName(sheetName);

  // Create a new sheet
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
    var campaignName = getCampaignNameById(campaignId); // get campaignName

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
      var cost = parseFloat(row['Cost']); 
      var conversions = row['Conversions'];
      sheet.appendRow([campaignName, searchTerm, cost, conversions]);

      if (createAndExclude === 'YES') {
        exclusionList.push(searchTerm);
      }
    }

    if (createAndExclude === 'YES' && exclusionList.length > 0) {
      var keywordsExcluded = addKeywordsToExclusionList(campaignId, exclusionList);
      if (keywordsExcluded > 0) {
        excludedKeywordsInfo.push({ campaignId: campaignId, count: keywordsExcluded });
      }
    }
  }

  // Append information about automatically excluded keywords to the email body
  if (excludedKeywordsInfo.length > 0) {
    emailBody += '\n\nKeywords were automatically excluded in the following campaigns:';
    for (var i = 0; i < excludedKeywordsInfo.length; i++) {
      var info = excludedKeywordsInfo[i];
      emailBody += '\nCampaign ID ' + info.campaignId + ': ' + info.count + ' keywords';
    }
  }

  MailApp.sendEmail(notificationEmail, emailSubject, emailBody);
}

function getCampaignNameById(campaignId) {
  var campaignIterator = AdsApp.campaigns().withIds([campaignId]).get();
  if (campaignIterator.hasNext()) {
    return campaignIterator.next().getName();
  }
  return 'Unknown Campaign'; // Default name if the campaign is not found
}

function addKeywordsToExclusionList(campaignId, keywords) {
  var campaign = AdsApp.campaigns().withIds([campaignId]).get().next();
  var negativeKeywordList;
  var keywordListIterator = AdsApp.negativeKeywordLists()
                                  .withCondition('Name = "Exclusion List for Campaign ' + campaignId + '"')
                                  .get();

  // Check if the exclusion list already exists
  if (keywordListIterator.hasNext()) {
    negativeKeywordList = keywordListIterator.next();
  } else {
    negativeKeywordList = AdsApp.newNegativeKeywordListBuilder()
                                .withName('Exclusion List for Campaign ' + campaignId)
                                .build()
                                .getResult();
  }

  var excludedCount = 0;
  for (var i = 0; i < keywords.length; i++) {
    var exactMatchKeyword = '[' + keywords[i] + ']'; // Format as exact match
    negativeKeywordList.addNegativeKeyword(exactMatchKeyword);
    excludedCount++;
  }

  campaign.addNegativeKeywordList(negativeKeywordList);
  return excludedCount;
}

