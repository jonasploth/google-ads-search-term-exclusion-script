# google-ads-search-term-exclusion-script
# Documentation for Enhanced Google Ads Script: Search Term Analysis with Optional Exclusion List Creation

# Overview
This Google Ads script performs a detailed analysis of search terms from a specified campaign over a chosen time frame. It identifies search terms that have incurred significant costs (above a set threshold) but yielded no conversions. Additionally, it features a "Create & Exclude" option, allowing users to automatically create an exclusion list of these terms and apply it to their campaign.

# Prerequisites
Access to a Google Ads account.
A Google Sheets URL to store the output.
Basic understanding of Google Ads and Google Apps Script.

# Setup Instructions
Google Sheets Setup:

Create or select a Google Sheet to store the script's output.
Keep the URL of this sheet handy for the script setup.
Google Ads Script Configuration:

In your Google Ads account, navigate to 'Tools & Settings' > 'Scripts'.
Add a new script and name it appropriately.
Copy and paste the provided script into the script editor.

# Script Customization:

Replace 'IHR_SPREADSHEET_URL' with your Google Sheet's URL.
Replace 'IHRE_KAMPAGNEN_ID' with the ID of the campaign to analyze.
Set costThreshold to your desired cost limit (in micro-units).
Adjust daysAgo to define the analysis period (in days).
Set createAndExclude to 'YES' to enable exclusion list creation, or 'NO' to disable it.
Usage Instructions
Running the Script:

Click the 'Run' button in the Google Ads script editor.
Authorize any permissions requested by the script.
Viewing Results:

Access your specified Google Sheet to view the output.
The sheet will list search terms, their respective costs, and conversion data.

# Exclusion List:

If createAndExclude is set to 'YES', the script will create an exclusion list named 'Exclusion List for Campaign [CampaignID]' and add it to your campaign.

# Additional Notes
The script processes costs in micro-units (1 Euro = 1,000,000 micro-units).
Ensure the script's timezone matches your Google Ads account's timezone.

# Troubleshooting
Date Format Issues: Verify that the script's date format aligns with 'YYYYMMDD'.
Permission Errors: Ensure you have the necessary permissions for Google Ads and Google Sheets.
