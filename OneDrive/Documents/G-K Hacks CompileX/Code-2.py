import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import gspread
from google.oauth2.service_account import Credentials

# ---------------- Google Sheets Setup ----------------
SCOPE = ["https://www.googleapis.com/auth/spreadsheets"]
try:
    creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPE)
    client = gspread.authorize(creds)
    SHEET_ID = "1mzMSW3Pp4pGzAhquQQ6-D0FtLa94wO3FICb_joX3Uz4"
    sheet = client.open_by_key(SHEET_ID).sheet1
except Exception as e:
    st.error(f"Google Sheets connection error: {e}")
    class DummySheet:
        def append_row(self, data):
            raise Exception("Google Sheet connection failed.")
    sheet = DummySheet()

# ---------------- Streamlit Config ----------------
st.set_page_config(page_title="🌿 Karunya Carbon Dashboard 3.0", layout="wide")
st.markdown("""
    <style>
        section[data-testid="stSidebar"] {
            background-image: linear-gradient(180deg, #eaffea 0%, #c8f0d2 100%);
        }
        h1, h2, h3 { color: #12664F; }
        .stButton>button { 
            background-color: #16A085; color: white; border-radius: 10px; 
            padding: 10px 18px; font-weight: 600;
        }
        .stButton>button:hover { background-color: #138D75; color: white; }
    </style>
""", unsafe_allow_html=True)

st.title("🌿 Karunya Interactive Carbon Dashboard")
st.caption("A dynamic sustainability tracker built with Streamlit + Plotly + Google Sheets")

# ---------------- Tabs ----------------
tab1, tab2, tab3, tab4 = st.tabs(["📝 Data Entry", "📊 Dashboard", "🌡️ Heatmaps", "🧭 3D Visualizations"])

# ---------------------------------------------
# 📝 TAB 1 - Data Entry Form
# ---------------------------------------------
with tab1:
    st.header("Submit Your Monthly Data 🌱")
    with st.form("data_form"):
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input("Name *")
            regno = st.text_input("Register Number")
            dept = st.text_input("Department")
            hostel = st.text_input("Hostel/Block")
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
            diet = st.selectbox("Diet Type", ["Meat-heavy", "Vegetarian", "Vegan"])
        with col2:
            distance = st.number_input("Daily Commute Distance (km)", 0.0, 100.0, 5.0)
            electricity = st.number_input("Electricity Use (kWh/month)", 0.0, 2000.0, 250.0)
            water = st.number_input("Water Use (litres/month)", 0.0, 10000.0, 3000.0)
            classes = st.slider("Number of Campus Days", 0, 31, 22)
            activities = st.multiselect("Eco Activities:", ["Planted Trees", "Recycling", "Carpool", "Cycling", "Green Club"])
        submitted = st.form_submit_button("Calculate & Save")

    # Emission factors
    factors = {"car": 0.192, "electricity": 0.82, "water": 0.0003,
               "Meat-heavy": 7.0, "Vegetarian": 3.8, "Vegan": 2.9}

    if submitted:
        if not name:
            st.error("Please enter your name!")
        else:
            transport = distance * 2 * classes * factors["car"]
            power = electricity * factors["electricity"]
            aqua = water * factors["water"]
            diet_co2 = factors[diet] * 30
            eco_bonus = 0.9 if activities else 1.0
            total_co2 = round((transport + power + aqua + diet_co2) * eco_bonus, 2)
            st.success(f"✅ {name}, your estimated monthly CO₂ footprint is **{total_co2} kg CO₂e** 🌎")
            try:
                sheet.append_row([name, regno, dept, hostel, gender, diet, distance, electricity, water, total_co2, classes, ",".join(activities)])
                st.info("Data saved successfully ✅")
            except Exception as e:
                st.warning(f"⚠️ Could not save to Google Sheets: {e}")

# ---------------------------------------------
# 📊 TAB 2 - Dashboard
# ---------------------------------------------
with tab2:
    st.header("Community Insights & Trends 📈")
    try:
        data = sheet.get_all_values()
        if data:
            df = pd.DataFrame(data[1:], columns=data[0])
            for col in ["distance", "electricity", "water", "total_co2", "classes"]:
                df[col] = pd.to_numeric(df[col], errors="coerce")

            colf1, colf2 = st.columns(2)
            with colf1:
                dept_filter = st.selectbox("Filter by Department", ["All"] + sorted(df["dept"].unique().tolist()))
            with colf2:
                diet_filter = st.multiselect("Filter by Diet Type", df["diet"].unique().tolist(), default=df["diet"].unique().tolist())

            if dept_filter != "All":
                df = df[df["dept"] == dept_filter]
            df = df[df["diet"].isin(diet_filter)]

            # Leaderboard
            st.subheader("🏆 CO₂ Leaderboard")
            top_n = st.slider("Show top N:", 5, 30, 10)
            leaderboard = df.sort_values(by="total_co2", ascending=False).head(top_n)
            fig_lb = px.bar(leaderboard, x="name", y="total_co2", color="total_co2", color_continuous_scale="viridis")
            st.plotly_chart(fig_lb, use_container_width=True)

            # Scatter: Distance vs CO₂
            st.subheader("🚗 Distance vs CO₂ Emission")
            fig_sc = px.scatter(df, x="distance", y="total_co2", size="electricity", color="diet",
                                hover_name="name", title="Commute Impact on CO₂", size_max=40)
            st.plotly_chart(fig_sc, use_container_width=True)

            # Simulated Line Trend
            st.subheader("📅 Monthly Average CO₂ Trend")
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            avg = np.random.uniform(100, 200, len(months))
            fig_ln = px.line(x=months, y=avg, markers=True, color_discrete_sequence=["#1abc9c"])
            fig_ln.update_layout(title="Average CO₂ Emission Over Time", xaxis_title="Month", yaxis_title="Avg CO₂ (kg)")
            st.plotly_chart(fig_ln, use_container_width=True)
        else:
            st.info("No data available yet. Submit an entry first.")
    except Exception as e:
        st.error(f"Error loading data: {e}")

# ---------------------------------------------
# 🌡️ TAB 3 - Heatmaps
# ---------------------------------------------
with tab3:
    st.header("Eco Activity Heatmap 🌱")
    try:
        data = sheet.get_all_values()
        if data:
            df = pd.DataFrame(data[1:], columns=data[0])
            activity_cols = ["Planted Trees", "Recycling", "Carpool", "Cycling", "Green Club"]
            counts = {a: 0 for a in activity_cols}
            for acts in df["activities"]:
                if acts:
                    for act in acts.split(","):
                        act = act.strip()
                        if act in counts:
                            counts[act] += 1
            act_df = pd.DataFrame(list(counts.items()), columns=["Activity", "Participants"])
            fig_heat = go.Figure(data=go.Heatmap(
                z=[act_df["Participants"]],
                x=act_df["Activity"],
                y=["Activity Count"],
                colorscale="Greens",
                showscale=True
            ))
            fig_heat.update_layout(title="Eco Activity Participation Heatmap")
            st.plotly_chart(fig_heat, use_container_width=True)
        else:
            st.warning("No activity data found.")
    except Exception as e:
        st.error(f"Error creating heatmap: {e}")

# ---------------------------------------------
# 🧭 TAB 4 - Enhanced 3D Visualizations (merged & fixed)
# ---------------------------------------------
with tab4:
    st.header("3D Carbon Analytics 🌍")
    try:
        data = sheet.get_all_values()
        if not data or len(data) < 2:
            st.info("No data for 3D visualization.")
        else:
            df = pd.DataFrame(data[1:], columns=data[0])
            for col in ["distance", "electricity", "water", "total_co2"]:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

            # Sidebar filters
            st.subheader("Filter & Visualization Settings")
            col1, col2, col3 = st.columns(3)
            with col1:
                d_range = st.slider("Distance (km)", float(df["distance"].min()), float(df["distance"].max()), 
                                    (float(df["distance"].min()), float(df["distance"].max())))
            with col2:
                e_range = st.slider("Electricity (kWh)", float(df["electricity"].min()), float(df["electricity"].max()), 
                                    (float(df["electricity"].min()), float(df["electricity"].max())))
            with col3:
                co2_range = st.slider("CO₂ (kg)", float(df["total_co2"].min()), float(df["total_co2"].max()), 
                                      (float(df["total_co2"].min()), float(df["total_co2"].max())))

            mask = (
                (df["distance"] >= d_range[0]) & (df["distance"] <= d_range[1]) &
                (df["electricity"] >= e_range[0]) & (df["electricity"] <= e_range[1]) &
                (df["total_co2"] >= co2_range[0]) & (df["total_co2"] <= co2_range[1])
            )
            df_f = df[mask]

            color_by = st.selectbox("Color by", ["total_co2", "diet"])
            size_by = st.selectbox("Size by", ["water", "electricity", "constant"])
            show_plane = st.checkbox("Show best-fit plane", True)

            # Size scaling
            if size_by == "constant":
                sizes = np.full(len(df_f), 15)
            else:
                val = df_f[size_by]
                sizes = 10 + 40 * ((val - val.min()) / (val.max() - val.min() + 1e-9))

            fig = go.Figure()
            fig.add_trace(go.Scatter3d(
                x=df_f["distance"], y=df_f["electricity"], z=df_f["total_co2"],
                mode="markers",
                marker=dict(
                    size=sizes,
                    color=df_f[color_by],
                    colorscale="Viridis" if color_by == "total_co2" else "Portland",
                    showscale=color_by == "total_co2",
                    opacity=0.85
                ),
                hovertext=df_f["name"]
            ))

            # Optional regression plane
            if show_plane and len(df_f) >= 3:
                X = np.column_stack((df_f["distance"], df_f["electricity"], np.ones(len(df_f))))
                Z = df_f["total_co2"].values
                coeffs, *_ = np.linalg.lstsq(X, Z, rcond=None)
                a, b, c = coeffs
                x_lin = np.linspace(df_f["distance"].min(), df_f["distance"].max(), 20)
                y_lin = np.linspace(df_f["electricity"].min(), df_f["electricity"].max(), 20)
                xx, yy = np.meshgrid(x_lin, y_lin)
                zz = a * xx + b * yy + c
                fig.add_trace(go.Surface(x=xx, y=yy, z=zz, opacity=0.4, colorscale="Reds", showscale=False))

            fig.update_layout(
                scene=dict(
                    xaxis_title="Distance (km)",
                    yaxis_title="Electricity (kWh)",
                    zaxis_title="Total CO₂ (kg)"
                ),
                title="3D Carbon Footprint Visualization (Improved)",
                margin=dict(l=0, r=0, b=0, t=30)
            )
            st.plotly_chart(fig, use_container_width=True)
    except Exception as e:
        st.error(f"3D Visualization error: {e}")

st.markdown("---")
st.caption("Karunya University | Sustainable Data Innovation Dashboard 🌿 Built with ❤️ using Streamlit + Plotly")
