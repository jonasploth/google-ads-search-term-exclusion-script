# google-ads-search-term-exclusion-script
# Documentation for Enhanced Google Ads Script: Search Term Analysis with Optional Exclusion List Creation

# Overview
This script analyzes search terms for multiple Google Ads campaigns over a defined period. It identifies search terms that incurred substantial costs without conversions and offers an option to create an exclusion list for these terms in the specified campaigns.

# Prerequisites
Google Ads account access.
A Google Sheets URL for output.
Basic understanding of Google Ads and Google Apps Script.
Configuration Instructions

# Configuring the Script:

Open the script in the Google Ads script editor.
Locate the 'START OF CONFIGURATION' section at the beginning of the script.

# Parameters to Configure:

spreadsheetUrl: Replace this with the URL of your Google Sheet.
campaignIds: Add the IDs of the campaigns you want to analyze as an array.
costThreshold: Set this to your desired cost limit in micro-units (e.g., €50 = 50,000,000).
daysAgo: Define the number of days for the analysis period.
createAndExclude: Set to 'YES' to enable exclusion list creation or 'NO' to disable it.
Do not modify the code below the 'DO NOT TOUCH CODE BELOW HERE' comment as it contains the core functionality of the script.

# Usage Instructions

## Running the Script:

After configuring, click 'Run' in the script editor.
Authorize any permissions the script requests.
Output:

The script outputs to your specified Google Sheet, listing campaign IDs, search terms, their costs, and conversions.
If 'Create & Exclude' is set to 'YES', it will also create an exclusion list named 'Exclusion List for Campaign [CampaignID]' and add it to each specified campaign.

# Additional Notes
The script processes costs in micro-units (1 Euro = 1,000,000 micro-units).
Ensure the script's timezone matches your Google Ads account's timezone.

# Troubleshooting
Date Format Issues: Ensure the script's date format is 'YYYYMMDD'.
Permission Errors: Make sure you have necessary permissions for Google Ads and Google Sheets.

