🤖 AI Expense Approval Agent – Web-Based Intelligent System
📌 Project Overview

The AI Expense Approval Agent is a web-based intelligent expense management system designed to automate and optimize organizational expense approvals.
It simulates AI agents that analyze company policies, employee spending behavior, and historical data to decide whether an expense should be Approved, Pending, or Rejected.

The system is built using Python (Flask) for backend processing and HTML, CSS, JavaScript (Chart.js) for an interactive and professional web interface.

🎯 Key Objectives

Automate expense approval workflows

Reduce manual review overhead

Detect abnormal spending patterns

Provide real-time analytics and auditability

Demonstrate AI-agent–based decision-making logic

🧠 AI Agent Architecture

The system follows a multi-agent AI design, where each agent has a specific responsibility:

1️⃣ Memory Agent

Stores all expense records in a JSON file

Maintains employee-wise historical spending data

Enables learning from past decisions

2️⃣ Policy Agent

Enforces organizational expense rules:

Auto-approval limit

Manager review limit

Monthly budget cap

Allowed expense categories

3️⃣ Pattern Agent

Analyzes employee spending behavior

Calculates average historical spending

Detects unusual or abnormal expenses

4️⃣ Decision Agent

Combines policy validation and behavioral analysis

Produces one of three outcomes:

APPROVED

PENDING (requires human review)

REJECTED

5️⃣ Explanation Agent

Generates human-readable explanations for every decision

Improves transparency and trust in AI decisions

🧾 Decision Logic Summary
Condition	Decision
Amount ≤ ₹1000	Approved (Auto)
₹1000–₹5000 + New Employee	Pending
₹1000–₹5000 + Normal Pattern	Approved
₹1000–₹5000 + Spending Anomaly	Pending
Policy / Budget Violation	Rejected
🌐 Web Application Features
🔹 Expense Submission Dashboard

Employee name input

Dropdown-based category selection

Amount input

AI-based decision generation

🔹 Real-Time AI Decision Output

Displays decision status

Shows AI-generated explanation

Timestamped audit trail

🔹 Interactive Analytics

Bar Chart: Approved vs Pending vs Rejected

Doughnut Chart: Expense distribution

Automatically updates when new data is saved

🔹 Persistent Storage

All expenses stored locally in expense_memory.json

Data remains available across application restarts

🛠️ Technology Stack
Layer	Technology
Backend	Python, Flask
Frontend	HTML, CSS, JavaScript
Visualization	Chart.js
Storage	JSON (file-based)
IDE	Visual Studio Code
🚀 How to Run the Project
1️⃣ Install Dependencies
pip install flask

2️⃣ Run the Application
python app.py

3️⃣ Access the Web App

The application automatically runs at:

http://127.0.0.1:5000

📊 Sample Use Case

Employee submits a travel expense of ₹3500

System checks policy limits

AI compares with past spending behavior

Expense is marked PENDING due to unusual pattern

Decision is logged and reflected in analytics

🧩 Future Enhancements

Role-based login (Employee / Manager / Admin)

Manager approval interface for pending expenses

AI confidence scoring and risk levels

Cloud database integration

Email or notification alerts

Machine learning model for advanced anomaly detection

🏁 Conclusion

The AI Expense Approval Agent demonstrates how agent-based AI systems can automate decision-making in real-world enterprise workflows.
By combining rule-based policies with behavioral analysis, the system ensures efficiency, fairness, and transparency in expense management.

🔗 Author

Arun
Computer Science Engineering Student | Software Developer
Passionate about AI systems, automation, and intelligent web applications 🚀
