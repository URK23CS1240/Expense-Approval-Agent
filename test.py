import gspread
from google.oauth2.service_account import Credentials

SCOPE = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPE)
client = gspread.authorize(creds)

sheet = client.open_by_key("1mzMSW3Pp4pGzAhquQQ6-D0FtLa94wO3FICb_joX3Uz4").sheet1
print("✅ Connected! First row:", sheet.row_values(1))
