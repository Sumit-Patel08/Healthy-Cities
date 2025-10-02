import os
import requests
import json
from datetime import datetime, timedelta
import pandas as pd

# Path relative to this script
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO_ROOT, "data", "heat")  # <-- force exact folder
os.makedirs(OUT_DIR, exist_ok=True)  # will not recreate nested extras

LAT, LON = 19.0760, 72.8777
PARAMS = ["T2M","T2M_MAX","T2M_MIN","RH2M","WS10M","PRECTOTCORR"]

END_DATE = datetime.now()
START_DATE = END_DATE - timedelta(days=730)

url = "https://power.larc.nasa.gov/api/temporal/daily/point"
payload = {
    "parameters": ",".join(PARAMS),
    "community": "RE",
    "longitude": LON,
    "latitude": LAT,
    "start": START_DATE.strftime("%Y%m%d"),
    "end": END_DATE.strftime("%Y%m%d"),
    "format": "JSON"
}

r = requests.get(url, params=payload)
r.raise_for_status()
data = r.json()

# Save JSON
json_path = os.path.join(OUT_DIR, "nasa_power.json")
with open(json_path, "w") as f:
    json.dump(data, f, indent=2)
print("Saved JSON ->", json_path)

# Convert to CSV
param_dict = data["properties"]["parameter"]
dates = sorted(param_dict["T2M"].keys())
df = pd.DataFrame({"date": pd.to_datetime(dates, format="%Y%m%d")})

for p in PARAMS:
    df[p] = [param_dict[p][d] for d in dates]

csv_path = os.path.join(OUT_DIR, "nasa_power.csv")
df.to_csv(csv_path, index=False)
print("Saved CSV ->", csv_path)
