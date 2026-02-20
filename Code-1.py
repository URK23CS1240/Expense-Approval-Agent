import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import gspread
from google.oauth2.service_account import Credentials
import datetime
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# ---------- Google API Setup ----------
SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPE)
client = gspread.authorize(creds)
SHEET_ID = "1mzMSW3Pp4pGzAhquQQ6-D0FtLa94wO3FICb_joX3Uz4"
sheet = client.open_by_key(SHEET_ID).sheet1

# ---------- Professional UI Theme ----------
st.set_page_config(page_title="Karunya Carbon Footprint Pro", page_icon="🌱", layout="wide")
st.markdown("""
    <style>
    h1 {color: #379683;}
    .reportview-container .main .block-container{padding-top:2rem;}
    </style>
    """, unsafe_allow_html=True)
st.markdown("""
    <h1 style='text-align: center;'>Karunya University Carbon Footprint Tracker 🌱</h1>
    <div style='text-align:center;color:#5CDB95;font-size:18px;'>
    Make sustainability a competition and win campus-wide prizes!
    </div>
    """, unsafe_allow_html=True)
st.image("https://www.karunya.edu/sites/default/files/logo_0_0.png", width=120)
st.markdown("---")

# ---------- Inputs ----------

records = sheet.get_all_records(expected_headers=["name", "regno", "phone", "gender", "dept", "hostel", "location", "distance", "electricity", "water", "diet", "total", "classes", "activities", "timestamp"])


with st.form("carbon_form"):
    st.markdown("#### Enter your details (required fields *)")
    col1, col2 = st.columns([1.5, 1])
    with col1:
        name = st.text_input("Name*")
        regno = st.text_input("Registration Number*")
        phone = st.text_input("Phone Number (10 digits)*")
        gender = st.selectbox("Gender*", ["Female", "Male", "Other"])
        dept = st.text_input("Department*")
        hostelite = st.radio("Hostel Status*", ["Hostelite", "Day Scholar"])
        classes = st.number_input("Number of days present (last month)*", 0, 31, 22, step=1)
        commute_loc = st.selectbox("Commute/Base Location*", [
            "Karunya Hostel", "Karunya Guest House", "Peelamedu", "Gandhipuram", "Ukkadam", "Other"
        ])
        manual_dist = st.number_input("If Other: Enter distance (km - one way)*", 0.0, 50.0, step=0.5)
    with col2:
        electric = st.number_input("Monthly electricity used (kWh)*", 0.0, step=1.0)
        water = st.number_input("Monthly water used (litres)*", 0.0, step=10.0)
        diet = st.selectbox("Usual mess diet*", ["Meat-heavy", "Vegetarian", "Vegan"])
        activities = st.multiselect(
            "Eco Activities*", ["Planted trees", "Recycling", "Carpool", "Cycling", "Green Club"], default=[]
        )
    submitted = st.form_submit_button("Calculate & Analyze 🌎")

# Location distances (km, one way)
campus_locations = {
    "Karunya Hostel": 0.5,
    "Karunya Guest House": 2,
    "Peelamedu": 28,
    "Gandhipuram": 32,
    "Ukkadam": 25,
    "Other": manual_dist if manual_dist > 0 else 0.5
}

# ---------- Emission Factors ----------
factors = {
    "car": 0.192, "electricity": 0.82, "water": 0.0003,
    "Meat-heavy": 7.0, "Vegetarian": 3.8, "Vegan": 2.9
}

# ---------- ANALYSIS & VISUALIZATION ----------
if submitted:
    missing = (
        not name.strip() or not regno.strip() or not phone.isdigit() or len(phone) != 10 or
        not gender or not dept.strip() or electric == 0 or water == 0 or len(diet) == 0 or classes == 0
    )
    if missing or (commute_loc == "Other" and manual_dist == 0):
        st.error("Please fill all required fields (marked with *), and try again.")
    else:
        commute_km = campus_locations[commute_loc]
        transport = commute_km * classes * 2 * factors["car"]
        power = electric * factors["electricity"]
        aqua = water * factors["water"]
        diet_co2 = factors[diet] * 30
        eco_bonus = 0.95 if len(activities) >= 2 else 1.0
        total = round((transport + power + aqua + diet_co2) * eco_bonus, 2)

        st.success(
            f"🌱 {name} ({dept}), your carbon footprint this month is: **{total} kg CO₂e**"
        )
        st.caption(f"Commute: {commute_km} km each way • Days Present: {classes}")

        # ---------- Custom Pie Chart ----------
        st.markdown("##### Your Carbon Breakdown")
        labels = ["Transport", "Electricity", "Water", "Diet"]
        values = [transport, power, aqua, diet_co2]
        fig, ax = plt.subplots()
        colors = sns.color_palette("pastel")[0:4]
        ax.pie(values, labels=labels, autopct="%1.1f%%", startangle=90, colors=colors)
        ax.axis("equal")
        st.pyplot(fig)

        # ---------- Bar Chart Comparison ----------
        st.markdown("##### Category-wise Emissions (kg CO₂e)")
        bar_df = pd.DataFrame({
            "Category": labels,
            "Emissions": [transport, power, aqua, diet_co2]
        })
        st.bar_chart(bar_df.set_index("Category"))

        # ---------- Leaderboard Summary Chart from Google Sheets ----------
        st.markdown("##### Top 5 Lowest Footprints on Campus (Leaderboard)")
        records = sheet.get_all_records()
        df = pd.DataFrame(records)
        df_small = df.nsmallest(5, 'total', keep='all')
        leaderboard_chart = plt.figure(figsize=(8, 3))
        plt.bar(df_small['name'], df_small['total'], color='#379683')
        plt.xlabel('Name')
        plt.ylabel('Footprint (kg)')
        plt.title('Eco Leaders of the Month')
        plt.grid(axis='y', linestyle='--', alpha=0.5)
        st.pyplot(leaderboard_chart)

        # ---------- Visual Badge System ----------
        st.markdown("#### 🌟 Your Award")
        if total < 120:
            st.markdown("🏅 <span style='color:#379683;'>Eco Champion</span> – You inspire the campus!", unsafe_allow_html=True)
        elif total < 200:
            st.markdown("🌿 <span style='color:#5CDB95;'>Sustainability Starter</span>", unsafe_allow_html=True)
        else:
            st.markdown("🌱 <span style='color:#05386B;'>Fresh Green Journey</span>", unsafe_allow_html=True)

        # ---------- Save to Google Sheets ----------
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        try:
            sheet.append_row(
                [now, name, regno, phone, gender, dept, hostelite, commute_loc, commute_km, electric, water, diet, total, classes, ",".join(activities)]
            )
            st.success("💾 Data Saved to Campus Dashboard!")
        except Exception as e:
            st.error(f"❌ Error saving: {e}")

st.markdown("---")
st.caption("Karunya Sustainability | Team CompileX | Powered by Streamlit + Google Cloud 🌱")
