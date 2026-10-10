// Auto-generated static company packs data dictionary for 100% reliable production rendering
export interface QuestionDoc {
  round: string;
  text: string;
  modelAnswer: string;
  difficulty?: "easy" | "medium" | "hard";
  frequency?: "common" | "often" | "rare";
  tags?: string[];
}

export const COMPANY_PACKS_DATA: Record<string, { questions: QuestionDoc[] }> = {
  "tcs-ninja": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at TCS Ninja.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why TCS Ninja's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to TCS Ninja's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "tcs-digital": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at TCS Digital.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why TCS Digital's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to TCS Digital's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "infosys-spdse": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Infosys (SP / DSE).",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Infosys (SP / DSE)'s culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Infosys (SP / DSE)'s core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "wipro-elite-nlth": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Wipro Elite NLTH.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Wipro Elite NLTH's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Wipro Elite NLTH's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "accenture-adc": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Accenture (Advanced App Dev).",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Accenture (Advanced App Dev)'s culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Accenture (Advanced App Dev)'s core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "capgemini": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Capgemini.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Capgemini's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Capgemini's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "cognizant-genc": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Cognizant (GenC / Elevate).",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Cognizant (GenC / Elevate)'s culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Cognizant (GenC / Elevate)'s core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "hcltech": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at HCLTech.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why HCLTech's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to HCLTech's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "tech-mahindra": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Tech Mahindra.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Tech Mahindra's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Tech Mahindra's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "ltimindtree": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at LTIMindtree.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why LTIMindtree's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to LTIMindtree's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "mphasis": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Mphasis.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Mphasis's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Mphasis's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "hexaware": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Hexaware.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Hexaware's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Hexaware's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "persistent-systems": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Persistent Systems.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Persistent Systems's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Persistent Systems's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "deloitte-usi": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Deloitte USI.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Big 4 & Consulting, and why Deloitte USI's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Deloitte USI's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "ey-gds": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at EY GDS.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Big 4 & Consulting, and why EY GDS's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to EY GDS's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "kpmg-india": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at KPMG India.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Big 4 & Consulting, and why KPMG India's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to KPMG India's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "pwc-india": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at PwC India.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Big 4 & Consulting, and why PwC India's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to PwC India's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "zs-associates": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at ZS Associates.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Big 4 & Consulting, and why ZS Associates's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to ZS Associates's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "genpact": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain OOPs concepts in Java with real-world examples.",
        "modelAnswer": "OOPs: Encapsulation (data hiding), Abstraction (showing functionality), Inheritance (code reuse), Polymorphism (overloading/overriding).",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Java",
          "OOPs"
        ]
      },
      {
        "round": "Technical",
        "text": "Write a SQL query to find 2nd highest salary from Employee table.",
        "modelAnswer": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Genpact.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for IT Services & Consulting, and why Genpact's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Genpact's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "amazon-sde": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Amazon.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Amazon's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Amazon's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "microsoft": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Microsoft.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Microsoft's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Microsoft's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "google": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Google.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Google's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Google's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "adobe": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Adobe.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Adobe's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Adobe's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "salesforce": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Salesforce.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Salesforce's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Salesforce's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "oracle": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Oracle.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Oracle's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Oracle's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "ibm": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at IBM.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why IBM's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to IBM's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "sap-labs": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at SAP Labs.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why SAP Labs's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to SAP Labs's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "cisco": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Cisco.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Cisco's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Cisco's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "jpmorgan-chase": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at JPMorgan Chase & Co..",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Banking & Financial Services, and why JPMorgan Chase & Co.'s culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to JPMorgan Chase & Co.'s core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "american-express": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at American Express.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Banking & Financial Services, and why American Express's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to American Express's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "wells-fargo": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Wells Fargo.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Banking & Financial Services, and why Wells Fargo's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Wells Fargo's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "morgan-stanley": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Morgan Stanley.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Banking & Financial Services, and why Morgan Stanley's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Morgan Stanley's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "zoho": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Zoho.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Product & Big Tech, and why Zoho's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Zoho's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "flipkart": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Flipkart.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Fintech & E-Commerce, and why Flipkart's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Flipkart's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "phonepe": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at PhonePe.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Fintech & E-Commerce, and why PhonePe's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to PhonePe's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  },
  "paytm": {
    "questions": [
      {
        "round": "Aptitude Basics",
        "text": "A train running at 72 km/h crosses a 180m platform in 18 seconds. Find the length of the train.",
        "modelAnswer": "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 18 = 360m. Train length = 360 - 180 = 180 meters.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Speed & Distance"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "12 workers finish a task in 15 days. How many workers complete it in 10 days?",
        "modelAnswer": "Total work = 12 * 15 = 180 man-days. Workers needed = 180 / 10 = 18 workers.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Time & Work"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Probability of throwing a sum of 7 with two fair 6-sided dice?",
        "modelAnswer": "Pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. 6/36 = 1/6 (~16.67%).",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Probability"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "An article is sold for Rs. 850 at a 15% discount. Find marked price.",
        "modelAnswer": "Marked Price = 850 / 0.85 = Rs. 1,000.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Profit & Loss"
        ]
      },
      {
        "round": "Aptitude Basics",
        "text": "Find the compound interest on Rs 10,000 at 10% per annum for 2 years compounded annually.",
        "modelAnswer": "Amount = 10000 * (1.1)^2 = 12,100. CI = 12,100 - 10,000 = Rs 2,100.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Interest"
        ]
      },
      {
        "round": "Technical",
        "text": "Given an array of integers, find the contiguous subarray with maximum sum (Kadane's Algorithm).",
        "modelAnswer": "Initialize maxSoFar = nums[0], currMax = nums[0]. Iterate i=1..N-1: currMax = max(nums[i], currMax + nums[i]), maxSoFar = max(maxSoFar, currMax). Return maxSoFar. Time: O(N), Space: O(1).",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "Algorithms",
          "Dynamic Programming"
        ]
      },
      {
        "round": "Technical",
        "text": "Design a Rate Limiter using Token Bucket or Sliding Window algorithm.",
        "modelAnswer": "Use Token Bucket storing tokens per user. Refill rate = R tokens/sec, capacity = C. Atomically decrement token on incoming request using Redis Lua script.",
        "difficulty": "hard",
        "frequency": "common",
        "tags": [
          "System Design"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain the difference between Primary Key, Unique Key, and Foreign Key in relational databases.",
        "modelAnswer": "Primary Key: uniquely identifies row, non-null, 1 per table. Unique Key: enforces uniqueness, permits 1 NULL value. Foreign Key: references PK of another table.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "SQL",
          "DBMS"
        ]
      },
      {
        "round": "Technical",
        "text": "What is the difference between Process and Thread?",
        "modelAnswer": "Process: independent execution unit with isolated virtual memory space. Thread: lightweight execution segment within a process sharing heap memory and file descriptors.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Operating Systems"
        ]
      },
      {
        "round": "Technical",
        "text": "Explain REST vs GraphQL API architecture trade-offs.",
        "modelAnswer": "REST relies on fixed HTTP endpoints (over-fetching/under-fetching data). GraphQL allows clients to request exact JSON schema shapes in a single query endpoint.",
        "difficulty": "medium",
        "frequency": "often",
        "tags": [
          "Web Architecture",
          "APIs"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Describe a situation where you had a tight deadline and how you prioritized deliverables.",
        "modelAnswer": "Use STAR framework. Explain how you prioritized core MVP requirements, communicated with lead/stakeholders early, and delivered on schedule.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "STAR",
          "Time Management"
        ]
      },
      {
        "round": "Behavioral",
        "text": "Tell me about a time you resolved a technical conflict within your project team.",
        "modelAnswer": "Focus on active listening, creating an objective pros/cons comparison, running proof-of-concept benchmarks, and aligning on team goals.",
        "difficulty": "medium",
        "frequency": "common",
        "tags": [
          "Conflict Resolution",
          "Teamwork"
        ]
      },
      {
        "round": "HR",
        "text": "Tell me about yourself and why you want to work at Paytm.",
        "modelAnswer": "Give a 90-second elevator pitch covering academics, technical projects, passion for Fintech & E-Commerce, and why Paytm's culture fits your career goals.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Self Introduction"
        ]
      },
      {
        "round": "HR",
        "text": "Where do you see yourself in 3-5 years?",
        "modelAnswer": "Highlight technical mastery, taking product module ownership, mentoring junior engineers, and contributing to Paytm's core business metrics.",
        "difficulty": "easy",
        "frequency": "common",
        "tags": [
          "Career Goals"
        ]
      }
    ]
  }
};

export default COMPANY_PACKS_DATA;
