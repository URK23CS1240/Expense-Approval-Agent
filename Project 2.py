import json
import os
from datetime import datetime
from statistics import mean

MEMORY_FILE = "agent_memory.json"


# -------------------- MEMORY AGENT --------------------
class MemoryAgent:
    def __init__(self):
        self.memory = self.load_memory()

    def load_memory(self):
        if os.path.exists(MEMORY_FILE):
            with open(MEMORY_FILE, "r") as f:
                return json.load(f)
        return []

    def save(self):
        with open(MEMORY_FILE, "w") as f:
            json.dump(self.memory, f, indent=4)

    def store(self, record):
        self.memory.append(record)
        self.save()

    def fetch_employee_history(self, employee):
        return [r for r in self.memory if r["employee"] == employee]


# -------------------- POLICY AGENT --------------------
class PolicyAgent:
    AUTO_APPROVE = 1000
    MANAGER_LIMIT = 10000
    MONTHLY_LIMIT = 25000

    def evaluate_policy(self, amount, monthly_total):
        if amount <= self.AUTO_APPROVE:
            return "AUTO_APPROVE"
        if amount <= self.MANAGER_LIMIT:
            return "REVIEW"
        if monthly_total + amount > self.MONTHLY_LIMIT:
            return "REJECT"
        return "REJECT"


# -------------------- PATTERN AGENT --------------------
class PatternAgent:
    def analyze_behavior(self, history):
        if not history:
            return "NEW_EMPLOYEE"

        avg_spending = mean([h["amount"] for h in history])
        return avg_spending


# -------------------- DECISION AGENT --------------------
class DecisionAgent:
    def make_decision(self, policy_result, behavior, amount):
        if policy_result == "AUTO_APPROVE":
            return "APPROVED", "Low-risk expense under auto-approval limit"

        if policy_result == "REVIEW":
            if behavior == "NEW_EMPLOYEE":
                return "PENDING", "New employee – requires manager review"
            if amount <= behavior * 1.5:
                return "APPROVED", "Matches employee spending pattern"
            return "PENDING", "Unusual spending – manual verification required"

        return "REJECTED", "Policy or budget violation detected"


# -------------------- MAIN AI AGENT --------------------
class ExpenseApprovalAIAgent:
    def __init__(self):
        self.memory_agent = MemoryAgent()
        self.policy_agent = PolicyAgent()
        self.pattern_agent = PatternAgent()
        self.decision_agent = DecisionAgent()

    def submit_expense(self, employee, category, amount):
        history = self.memory_agent.fetch_employee_history(employee)
        monthly_total = sum(h["amount"] for h in history)

        policy_result = self.policy_agent.evaluate_policy(amount, monthly_total)
        behavior = self.pattern_agent.analyze_behavior(history)

        decision, explanation = self.decision_agent.make_decision(
            policy_result, behavior, amount
        )

        record = {
            "employee": employee,
            "category": category,
            "amount": amount,
            "decision": decision,
            "reason": explanation,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        self.memory_agent.store(record)
        return record

    def audit_log(self):
        print("\n===== AI AGENT AUDIT LOG =====")
        for r in self.memory_agent.memory:
            print(
                f"{r['timestamp']} | {r['employee']} | {r['category']} | "
                f"₹{r['amount']} | {r['decision']} | {r['reason']}"
            )
        print("=============================\n")


# -------------------- RUNNER --------------------
def main():
    agent = ExpenseApprovalAIAgent()

    while True:
        print("\n🤖 AI Expense Approval Agent")
        print("1. Submit Expense")
        print("2. View Audit Log")
        print("3. Exit")

        choice = input("Choose option: ")

        if choice == "1":
            employee = input("Employee Name: ")
            category = input("Expense Category: ")
            amount = float(input("Amount (₹): "))

            result = agent.submit_expense(employee, category, amount)

            print("\n✅ AI Decision")
            print(f"Status : {result['decision']}")
            print(f"Reason : {result['reason']}")

        elif choice == "2":
            agent.audit_log()

        elif choice == "3":
            print("Exiting AI Agent...")
            break

        else:
            print("Invalid option!")


if __name__ == "__main__":
    main()
