# Quick Setup: Add Sample Data to Your Google Sheet

## Step 1: Open Your Google Sheet
Go to: https://docs.google.com/spreadsheets/d/1B-m1AoE8VO-vYlOnsT9IyuQAjyTqrCqV1cIjIWH_4zw/edit

## Step 2: Add Headers (if not already present)
In row 1, add these headers:
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| ID | Date | Amount | Type | Quantity | Description |

## Step 3: Add Sample Data
Copy and paste these sample transactions into rows 2-6:

```
tx_001	2025-07-01	250.00	sale	5	Coffee beans sold
tx_002	2025-07-01	45.50	expense	1	Coffee shop supplies
tx_003	2025-06-30	180.00	sale	3	Pastries sold
tx_004	2025-06-30	25.00	expense	1	Cleaning supplies
tx_005	2025-06-29	320.00	sale	8	Lunch orders
```

## Step 4: Refresh Your App
- Go back to your app at http://localhost:5178/
- The dashboard should now show your data with charts and analytics!

## How It Works
- ✅ **Reading**: The app reads data from your Google Sheet in real-time
- ⚠️ **Writing**: Currently in read-only mode (API key limitation)
- 📝 **Adding Data**: Manually add new rows to the sheet to see them appear in the app

## Next Steps
If you want full write functionality, we can implement:
1. OAuth2 authentication (more complex but full featured)
2. Google Forms integration (easier alternative)
3. Local storage with CSV export (simplest option)
