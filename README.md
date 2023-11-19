# google-ads-search-term-exclusion-script
# Documentation for Google Ads Script: Search Term Analysis and Export to Google Sheets
Overview
This script is designed to analyze search terms from a specific Google Ads campaign over the last 90 days. It filters and exports search terms that have resulted in 0 conversions but have incurred costs exceeding €50 to a Google Sheet.

Prerequisites
Access to a Google Ads account.
Basic knowledge of Google Ads and Google Apps Script.
Setup Instructions
Google Sheets Preparation:

Create a new Google Sheet or choose an existing one.
Note down the URL of the sheet; you'll need to insert it into the script.
Google Ads Script Setup:

Navigate to your Google Ads account.
Go to 'Tools & Settings' > 'Scripts'.
Click the '+' button to create a new script.
Name your script appropriately.
Script Configuration:

Copy the provided script into the script editor.
Replace 'IHR_SPREADSHEET_URL' with your Google Sheet's URL.
Replace 'IHRE_KAMPAGNEN_ID' with the ID of the campaign you want to analyze.
Usage Instructions
Running the Script:

After setting up the script, click on the 'Run' button in the Google Ads script editor.
Grant any necessary permissions.
Viewing Results:

Once the script has run successfully, open the Google Sheet you linked.
You will find a new sheet with the headings 'Suchbegriff', 'Kosten', and 'Conversions'.
Below these headings, you'll see the search terms that meet the criteria (0 conversions, more than €50 cost).
Additional Notes
The script calculates costs in micro amounts; €1 is 1,000,000 in the script.
Ensure that the timezone in the script ("PST") matches the timezone used in your Google Ads account.
Always test the script in a controlled environment before using it in production.
Troubleshooting
Invalid Date Range Error: Ensure the date format in the script matches the 'YYYYMMDD' format.
Permission Issues: Make sure you have granted all necessary permissions for the Google Ads account and Google Sheets.
