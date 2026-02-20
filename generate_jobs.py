import json
import random

roles = {
    "Tech": [
        ("Senior Frontend Developer", "React, TypeScript, Next.js"),
        ("Backend Engineer", "Go, Java, Spring Boot"),
        ("Data Scientist", "Python, TensorFlow, PyTorch"),
        ("DevOps Engineer", "AWS, Kubernetes, Terraform"),
        ("Product Manager", "B2C, Agile, Roadmapping"),
        ("QA Automation Engineer", "Selenium, Cypress, Java"),
        ("Full Stack Developer", "MERN Stack, AWS"),
        ("Android Developer", "Kotlin, Jetpack Compose"),
        ("iOS Developer", "Swift, SwiftUI"),
        ("UI/UX Designer", "Figma, Adobe XD, Prototyping")
    ],
    "Finance": [
        ("Financial Analyst", "Excel, Financial Modeling, SQL"),
        ("Investment Banker", "Valuation, M&A, Pitch Decks"),
        ("Risk Manager", "Risk Analysis, Compliance, SAS"),
        ("Chartered Accountant", "Taxation, Auditing, GST"),
        ("Wealth Manager", "Portfolio Management, CRM")
    ],
    "Marketing": [
        ("Digital Marketing Manager", "SEO, SEM, Google Ads"),
        ("Brand Manager", "Brand Strategy, Market Research"),
        ("Content Strategist", "Copywriting, SEO, Social Media"),
        ("Social Media Lead", "Instagram, LinkedIn, Analytics"),
        ("Growth Hacker", "A/B Testing, User Acquisition")
    ],
    "Operations": [
        ("Operations Manager", "Supply Chain, Logistics, SAP"),
        ("HR Business Partner", "Employee Relations, Recruiting"),
        ("Talent Acquisition Specialist", "Sourcing, Screening, LinkedIn"),
        ("Supply Chain Analyst", "Inventory Management, SQL"),
        ("Project Manager", "PMP, Jira, Stakeholder Mgmt")
    ]
}

companies = [
    ("Flipkart", "FK", "Bangalore, KA", "Large"),
    ("Razorpay", "RP", "Bangalore, KA", "Startup"),
    ("Zerodha", "ZD", "Bangalore, KA", "Startup"),
    ("Infosys", "IN", "Bangalore, KA", "Enterprise"),
    ("TCS", "TC", "Mumbai, MH", "Enterprise"),
    ("HDFC Bank", "HB", "Mumbai, MH", "Enterprise"),
    ("ICICI Bank", "IB", "Mumbai, MH", "Enterprise"),
    ("Reliance Industries", "RI", "Mumbai, MH", "Enterprise"),
    ("Zomato", "ZM", "Gurgaon, HR", "Mid-sized"),
    ("Swiggy", "SW", "Bangalore, KA", "Mid-sized"),
    ("Paytm", "PT", "Noida, UP", "Mid-sized"),
    ("Ola", "OL", "Bangalore, KA", "Mid-sized"),
    ("Freshworks", "FW", "Chennai, TN", "Large"),
    ("Zoho", "ZH", "Chennai, TN", "Large"),
    ("Nykaa", "NK", "Mumbai, MH", "Mid-sized"),
    ("Tata Motors", "TM", "Pune, MH", "Enterprise"),
    ("Wipro", "WI", "Bangalore, KA", "Enterprise"),
    ("Tech Mahindra", "TM", "Pune, MH", "Enterprise"),
    ("CRED", "CR", "Bangalore, KA", "Startup"),
    ("Meesho", "MS", "Bangalore, KA", "Startup"),
    ("PhonePe", "PP", "Bangalore, KA", "Mid-sized"),
    ("Delhivery", "DL", "Gurgaon, HR", "Mid-sized"),
    ("Urban Company", "UC", "Gurgaon, HR", "Startup"),
    ("Lenskart", "LK", "Delhi, DL", "Mid-sized"),
    ("Unacademy", "UA", "Bangalore, KA", "Startup")
]

platforms = ["LinkedIn", "Naukri", "Instahyre", "Glassdoor", "Indeed", "IIM Jobs"]
job_types = ["Full-time", "Contract", "Remote"]

jobs = []
for i in range(1, 61):
    category = random.choice(list(roles.keys()))
    role, skills = random.choice(roles[category])
    company, logo, location, size = random.choice(companies)
    
    # Salary logic based on role/company type
    if "Senior" in role or "Manager" in role:
        min_sal = random.randint(25, 40)
        max_sal = min_sal + random.randint(10, 20)
        exp = f"{random.randint(5, 10)}+ years"
    elif "Lead" in role:
        min_sal = random.randint(35, 50)
        max_sal = min_sal + random.randint(15, 30)
        exp = f"{random.randint(8, 12)}+ years"
    else:
        min_sal = random.randint(8, 18)
        max_sal = min_sal + random.randint(5, 12)
        exp = f"{random.randint(1, 4)}+ years"
    
    salary = f"₹{min_sal}–{max_sal} LPA"
    
    posted_days = random.randint(1, 30)
    posted = f"{posted_days} days ago" if posted_days > 1 else "Just now"
    if posted_days > 7:
         posted = f"{random.randint(1, 4)} weeks ago"

    job = {
        "id": i,
        "title": role,
        "company": company,
        "location": location,
        "type": random.choice(job_types) if "Remote" not in location else "Remote",
        "salary": salary,
        "platform": random.choice(platforms),
        "posted": posted,
        "experience": exp,
        "saved": random.random() < 0.2, # 20% saved
        "logo": logo,
        "description": f"Exciting opportunity for a {role} at {company}. Must have experience in {skills}. Join our dynamic team in {location.split(',')[0]}.",
        "matchScore": random.randint(60, 98),
        "remote": "Remote" in location or random.random() < 0.1,
        "companySize": size,
        "industry": category
    }
    jobs.append(job)

print(json.dumps(jobs, indent=4))
