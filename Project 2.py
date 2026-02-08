from flask import Flask, request, render_template_string
import json, os
from datetime import datetime
from statistics import mean

MEMORY_FILE = "expense_memory.json"
app = Flask(__name__)

# ================= MEMORY AGENT =================
class MemoryAgent:
    def __init__(self):
        if not os.path.exists(MEMORY_FILE):
            with open(MEMORY_FILE, "w") as f:
                json.dump([], f)

    def load(self):
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)

    def save(self, record):
        data = self.load()
        data.append(record)
        with open(MEMORY_FILE, "w") as f:
            json.dump(data, f, indent=4)

# ================= POLICY AGENT =================
class PolicyAgent:
    AUTO_LIMIT = 1000
    MANAGER_LIMIT = 15000
    MONTHLY_LIMIT = 200000
    ALLOWED = ["Travel","Food","Office Supplies","Training","Accommodation","Miscellaneous"]

    def check(self, amount, total, category):
        if category not in self.ALLOWED:
            return "REJECT"
        if amount <= self.AUTO_LIMIT:
            return "AUTO_APPROVE"
        if amount <= self.MANAGER_LIMIT and total + amount <= self.MONTHLY_LIMIT:
            return "REVIEW"
        return "REJECT"

# ================= PATTERN AGENT =================
class PatternAgent:
    def analyze(self, history):
        if not history:
            return "NEW"
        return mean([h["amount"] for h in history])

# ================= DECISION AGENT =================
class DecisionAgent:
    def decide(self, policy, behavior, amount):
        if policy == "AUTO_APPROVE":
            return "APPROVED", "Within auto-approval threshold"
        if policy == "REVIEW":
            if behavior == "NEW":
                return "PENDING", "New employee – manual review required"
            if amount <= behavior * 1.5:
                return "APPROVED", "Matches historical spending pattern"
            return "PENDING", "Spending anomaly detected"
        return "REJECTED", "Policy or budget violation"

# ================= EXPLANATION AGENT =================
class ExplanationAgent:
    def explain(self, decision, reason):
        return f"The expense was {decision} because {reason}."

# ================= MAIN AI =================
class ExpenseAIAgent:
    def __init__(self):
        self.mem = MemoryAgent()
        self.policy = PolicyAgent()
        self.pattern = PatternAgent()
        self.decision = DecisionAgent()
        self.explain = ExplanationAgent()

    def process(self, emp, cat, amt):
        data = self.mem.load()
        emp_hist = [d for d in data if d["employee"] == emp]
        total = sum(d["amount"] for d in emp_hist)

        p = self.policy.check(amt, total, cat)
        b = self.pattern.analyze(emp_hist)
        d, r = self.decision.decide(p, b, amt)

        return {
            "employee": emp,
            "category": cat,
            "amount": amt,
            "decision": d,
            "explanation": self.explain.explain(d, r),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    def stats(self):
        d = self.mem.load()
        return {
            "approved": len([x for x in d if x["decision"]=="APPROVED"]),
            "pending": len([x for x in d if x["decision"]=="PENDING"]),
            "rejected": len([x for x in d if x["decision"]=="REJECTED"])
        }

agent = ExpenseAIAgent()

# ================= UI =================
HTML = """
<!DOCTYPE html>
<html>
<head>
<title>AI Expense Approval Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body { font-family:Segoe UI; background:#f1f5f9; padding:20px }
.container { display:flex; gap:20px }
.card { background:white; padding:25px; border-radius:12px; width:48% }
button { padding:10px; background:#2563eb; color:white; border:none; margin-top:10px }
select,input { width:100%; padding:10px; margin-top:10px }
pre { background:#111; color:#0f0; padding:10px; height:160px; overflow:auto }
canvas { margin-top:20px }
</style>
</head>
<body>

<h1>🤖 AI Expense Approval Agent – Dashboard</h1>

<div class="container">
<div class="card">
<h3>Submit Expense</h3>
<form method="post">
<input name="emp" placeholder="Employee Name" required>
<select name="cat" required>
<option value="">Select Category</option>
<option>Travel</option><option>Food</option><option>Office Supplies</option>
<option>Training</option><option>Accommodation</option><option>Miscellaneous</option>
</select>
<input name="amt" type="number" placeholder="Amount ₹" required>
<button name="action" value="process">Process Expense</button>
<button name="action" value="save">Save Decision</button>
</form>

{% if result %}
<h4>AI Decision</h4>
<pre>{{ result }}</pre>
{% endif %}
</div>

<div class="card">
<h3>📊 Analytics</h3>
<canvas id="barChart"></canvas>
<canvas id="pieChart"></canvas>
</div>
</div>

<script>
const data = {{ stats | tojson }};
new Chart(barChart, {
type:'bar',
data:{labels:['Approved','Pending','Rejected'],
datasets:[{data:[data.approved,data.pending,data.rejected]}]}
});
new Chart(pieChart,{
type:'doughnut',
data:{labels:['Approved','Pending','Rejected'],
datasets:[{data:[data.approved,data.pending,data.rejected]}]}
});
</script>

</body>
</html>
"""

last_result = None

@app.route("/", methods=["GET","POST"])
def home():
    global last_result
    if request.method=="POST":
        if request.form["action"]=="process":
            last_result = agent.process(
                request.form["emp"],
                request.form["cat"],
                float(request.form["amt"])
            )
        elif request.form["action"]=="save" and last_result:
            agent.mem.save(last_result)
    return render_template_string(
        HTML,
        result=json.dumps(last_result,indent=4) if last_result else None,
        stats=agent.stats()
    )

if __name__ == "__main__":
    app.run(debug=True)
