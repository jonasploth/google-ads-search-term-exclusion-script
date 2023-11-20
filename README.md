# google-ads-search-term-exclusion-script
# Documentation for Enhanced Google Ads Script: Search Term Analysis with Optional Exclusion List Creation

# Overview
This script analyzes search terms for multiple Google Ads campaigns over a set period. It identifies terms with high costs and no conversions, offering an option to create an exclusion list. Additionally, it creates a new sheet in a Google Sheets document for each run, named by the date, and sends a customizable email notification upon completion.

# Prerequisites
Access to a Google Ads account.
A Google Sheets URL for output.
Basic understanding of Google Ads and Google Apps Script.

# Configuration Instructions
## Configuring the Script
Open the script in the Google Ads script editor.
Locate the 'Configuration Section' at the beginning of the script.

## Parameters to Configure
spreadsheetUrl: Replace with the URL of your Google Sheet.
campaignIds: Add the IDs of the campaigns you want to analyze.
costThresholdInEuros: Set the cost threshold in Euros (e.g., €50).
daysAgo: Define the number of days for the analysis period.
createAndExclude: Set to 'YES' for exclusion list creation, 'NO' to disable.
notificationEmail: Specify the email address for receiving notifications.
emailSubject: Customize the subject line of the notification email.
emailBody: Customize the body text of the notification email, including the spreadsheet URL.

# Usage Instructions

## Running the Script
Click 'Run' in the script editor after configuration.
Authorize any requested permissions.

## Output
The script outputs to a new or existing Google Sheet named with the current date.
It lists campaign names, search terms, costs, and conversions.
If 'Create & Exclude' is 'YES', an exclusion list named 'Exclusion List for Campaign [CampaignID]' is created for each specified campaign.

# Email Notification
Upon completion, the script sends an email to the specified address with the custom subject and body, including the link to the Google Sheet.

# Additional Notes
The script processes costs in micro-units (1 Euro = 1,000,000 micro-units).
Ensure the script's timezone matches your Google Ads account's timezone.

# Troubleshooting
Date Format Issues
Verify the script's date format is 'YYYYMMDD'.

# Permission Errors
Ensure necessary permissions for Google Ads and Google Sheets are granted.
