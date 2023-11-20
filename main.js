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

  // Convert cost
  var costThreshold = costThresholdInEuros * 1000000;
  var excludedKeywordsInfo = []; // To keep track of excluded keywords

  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var today = Utilities.formatDate(new Date(), "GMT", "yyyyMMdd");
  var sheetName = "Scan on " + today;
  var sheet = spreadsheet.getSheetByName(sheetName);

  // Create a new sheet if not existing
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(['Campaign Name', 'Ad Group Name', 'Search Term', 'Cost', 'Conversions']);
  }

  var endDate = new Date();
  var startDate = new Date();
  startDate.setDate(endDate.getDate() - daysAgo);
  
  var formattedStartDate = Utilities.formatDate(startDate, "PST", "yyyyMMdd");
  var formattedEndDate = Utilities.formatDate(endDate, "PST", "yyyyMMdd");

  for (var i = 0; i < campaignIds.length; i++) {
    var campaignId = campaignIds[i];
    var campaign = AdsApp.campaigns().withIds([campaignId]).get().next();
    var campaignName = campaign.getName();
    var adGroups = campaign.adGroups().get();

    while (adGroups.hasNext()) {
      var adGroup = adGroups.next();
      var adGroupId = adGroup.getId();
      var adGroupName = adGroup.getName();

      var query = "SELECT AdGroupId, Query, Cost, Conversions " +
                  "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
                  "WHERE AdGroupId = '" + adGroupId + "' " +
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
        sheet.appendRow([campaignName, adGroupName, searchTerm, cost, conversions]);

        if (createAndExclude === 'YES') {
          exclusionList.push(searchTerm);
        }
      }

      if (createAndExclude === 'YES' && exclusionList.length > 0) {
        var keywordsExcluded = addKeywordsToExclusionList(adGroupId, exclusionList);
        if (keywordsExcluded > 0) {
          excludedKeywordsInfo.push({ adGroupName: adGroupName, count: keywordsExcluded });
        }
      }
    }
  }

  // Append information about automatically excluded keywords to the email body
  if (excludedKeywordsInfo.length > 0) {
    emailBody += '\n\nKeywords were automatically excluded in the following ad groups:';
    for (var i = 0; i < excludedKeywordsInfo.length; i++) {
      var info = excludedKeywordsInfo[i];
      emailBody += '\nAd Group ' + info.adGroupName + ': ' + info.count + ' keywords';
    }
  }

  MailApp.sendEmail(notificationEmail, emailSubject, emailBody);
}

function addKeywordsToExclusionList(adGroupId, keywords) {
  var adGroup = AdsApp.adGroups().withIds([adGroupId]).get().next();
  var excludedCount = 0;

  for (var i = 0; i < keywords.length; i++) {
    var exactMatchKeyword = '[' + keywords[i] + ']';
    adGroup.createNegativeKeyword(exactMatchKeyword);
    excludedCount++;
  }

  return excludedCount;
}

