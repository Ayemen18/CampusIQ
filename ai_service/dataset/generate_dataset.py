import json
import csv
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

# 1. Faculty Information (25 records)
faculty_data = [
    {"doc_id": "FAC_001", "name": "Mrs. Arshiya Begum", "department": "CSE - Data Science", "designation": "Assistant Professor", "subjects": ["Machine Learning", "Natural Language Processing", "RAG Systems"], "email": "arshiya.begum@mlrit.ac.in"},
    {"doc_id": "FAC_002", "name": "Dr. K. Srinivas Rao", "department": "Computer Science & Engineering", "designation": "Professor & HOD", "subjects": ["Advanced Algorithms", "Cloud Computing"], "email": "srinivas.cse@mlrit.ac.in"},
    {"doc_id": "FAC_003", "name": "Dr. P. Radha Krishna", "department": "Information Technology", "designation": "Professor", "subjects": ["Database Management Systems", "Distributed Systems"], "email": "radhakrishna.it@mlrit.ac.in"},
    {"doc_id": "FAC_004", "name": "Mrs. T. Swathi", "department": "CSE - Data Science", "designation": "Associate Professor", "subjects": ["Data Mining and Data Warehousing", "Deep Learning"], "email": "swathi.ds@mlrit.ac.in"},
    {"doc_id": "FAC_005", "name": "Mr. M. Naresh Kumar", "department": "CSE - AI & ML", "designation": "Assistant Professor", "subjects": ["Artificial Intelligence", "Reinforcement Learning"], "email": "naresh.aiml@mlrit.ac.in"},
    {"doc_id": "FAC_006", "name": "Dr. B. Sudarshan Reddy", "department": "Computer Science & Engineering", "designation": "Associate Professor", "subjects": ["Operating Systems", "Computer Networks"], "email": "sudarshan.cse@mlrit.ac.in"},
    {"doc_id": "FAC_007", "name": "Mrs. V. Lakshmi Prasanna", "department": "CSE - Cyber Security", "designation": "Assistant Professor", "subjects": ["Network Security", "Cryptography", "Ethical Hacking"], "email": "lakshmi.cyber@mlrit.ac.in"},
    {"doc_id": "FAC_008", "name": "Dr. G. Ravi Chandra", "department": "Information Technology", "designation": "Associate Professor", "subjects": ["Web Technologies", "Full Stack Development"], "email": "ravichandra.it@mlrit.ac.in"},
    {"doc_id": "FAC_009", "name": "Mr. K. Vamshi Krishna", "department": "CSE - Data Science", "designation": "Assistant Professor", "subjects": ["Big Data Analytics", "Python for Data Science"], "email": "vamshi.ds@mlrit.ac.in"},
    {"doc_id": "FAC_010", "name": "Mrs. S. Deepthi", "department": "Computer Science & Engineering", "designation": "Assistant Professor", "subjects": ["Compiler Design", "Formal Languages & Automata"], "email": "deepthi.cse@mlrit.ac.in"},
    {"doc_id": "FAC_011", "name": "Dr. N. Mahesh", "department": "Electronics & Communication", "designation": "Professor", "subjects": ["VLSI Design", "Embedded Systems"], "email": "mahesh.ece@mlrit.ac.in"},
    {"doc_id": "FAC_012", "name": "Mrs. R. Sravanthi", "department": "CSE - AI & ML", "designation": "Assistant Professor", "subjects": ["Computer Vision", "Digital Image Processing"], "email": "sravanthi.aiml@mlrit.ac.in"},
    {"doc_id": "FAC_013", "name": "Dr. C. Harish", "department": "Mathematics & Humanities", "designation": "Associate Professor", "subjects": ["Probability & Statistics", "Linear Algebra"], "email": "harish.math@mlrit.ac.in"},
    {"doc_id": "FAC_014", "name": "Mr. Syed Riaz", "department": "Training & Placement Cell", "designation": "Dean - Career Development", "subjects": ["Placement Soft Skills", "Interview Preparation"], "email": "placements@mlrit.ac.in"},
    {"doc_id": "FAC_015", "name": "Dr. A. Anand", "department": "Mechanical Engineering", "designation": "Professor", "subjects": ["Robotics", "CAD/CAM"], "email": "anand.mech@mlrit.ac.in"},
    {"doc_id": "FAC_016", "name": "Mrs. Bhavani Devi", "department": "CSE - Data Science", "designation": "Assistant Professor", "subjects": ["Business Intelligence", "Tableau & Power BI"], "email": "bhavani.ds@mlrit.ac.in"},
    {"doc_id": "FAC_017", "name": "Mr. D. Praveen", "department": "Computer Science & Engineering", "designation": "Assistant Professor", "subjects": ["Software Engineering", "Agile & DevOps"], "email": "praveen.cse@mlrit.ac.in"},
    {"doc_id": "FAC_018", "name": "Dr. Sandhya Rani", "department": "Information Technology", "designation": "Professor", "subjects": ["Mobile Application Development", "Internet of Things"], "email": "sandhya.it@mlrit.ac.in"},
    {"doc_id": "FAC_019", "name": "Mr. J. Kiran", "department": "Physical Education", "designation": "Physical Director", "subjects": ["Sports Management", "Fitness & Yoga"], "email": "sports@mlrit.ac.in"},
    {"doc_id": "FAC_020", "name": "Mrs. Anita Rao", "department": "Dean Student Affairs", "designation": "Associate Professor", "subjects": ["Student Welfare & Mentorship"], "email": "studentaffairs@mlrit.ac.in"},
    {"doc_id": "FAC_021", "name": "Dr. Venkat Raman", "department": "CSE - Data Science", "designation": "Professor", "subjects": ["Data Engineering", "Apache Spark & Hadoop"], "email": "venkat.ds@mlrit.ac.in"},
    {"doc_id": "FAC_022", "name": "Mrs. K. Madhavi", "department": "Computer Science & Engineering", "designation": "Assistant Professor", "subjects": ["Object Oriented Programming with Java"], "email": "madhavi.cse@mlrit.ac.in"},
    {"doc_id": "FAC_023", "name": "Mr. Y. Rajesh", "department": "CSE - Cyber Security", "designation": "Assistant Professor", "subjects": ["Cyber Forensics", "Malware Analysis"], "email": "rajesh.cyber@mlrit.ac.in"},
    {"doc_id": "FAC_024", "name": "Dr. Shalini Gupta", "department": "Mathematics & Humanities", "designation": "Assistant Professor", "subjects": ["Technical Communication", "Professional Ethics"], "email": "shalini.hss@mlrit.ac.in"},
    {"doc_id": "FAC_025", "name": "Dr. E. Suresh", "department": "Examination Cell", "designation": "Controller of Examinations", "subjects": ["Academic Audits", "Exam Administration"], "email": "coe@mlrit.ac.in"}
]

# 2. Course Information (20 records)
course_data = [
    {"doc_id": "CRS_001", "course": "CS701PC: Machine Learning", "semester": 7, "credits": 4, "department": "CSE - Data Science", "faculty": "Mrs. Arshiya Begum", "syllabus": "Supervised, Unsupervised learning, Neural Networks, Decision Trees, SVM, Evaluation Metrics."},
    {"doc_id": "CRS_002", "course": "DS702PC: Natural Language Processing", "semester": 7, "credits": 3, "department": "CSE - Data Science", "faculty": "Mrs. Arshiya Begum", "syllabus": "N-grams, Word2Vec, Transformers, BERT, LLMs, Retrieval Augmented Generation (RAG)."},
    {"doc_id": "CRS_003", "course": "CS703PC: Cloud Computing and Virtualization", "semester": 7, "credits": 3, "department": "Computer Science & Engineering", "faculty": "Dr. K. Srinivas Rao", "syllabus": "AWS, GCP, Virtualization, Containers, Docker, Kubernetes, Cloud Storage."},
    {"doc_id": "CRS_004", "course": "DS704PE: Deep Learning & Neural Architectures", "semester": 7, "credits": 3, "department": "CSE - Data Science", "faculty": "Mrs. T. Swathi", "syllabus": "CNNs, RNNs, LSTMs, Attention Mechanisms, Generative Adversarial Networks (GANs)."},
    {"doc_id": "CRS_005", "course": "CS705PC: Full Stack Web Development", "semester": 7, "credits": 4, "department": "Information Technology", "faculty": "Dr. G. Ravi Chandra", "syllabus": "React.js, Node.js, Express, MongoDB, RESTful APIs, Tailwind CSS, State Management."},
    {"doc_id": "CRS_006", "course": "CS501PC: Database Management Systems", "semester": 5, "credits": 4, "department": "Computer Science & Engineering", "faculty": "Dr. P. Radha Krishna", "syllabus": "ER Modeling, Relational Algebra, SQL, Normalization (1NF to BCNF), Transactions, Concurrency."},
    {"doc_id": "CRS_007", "course": "CS502PC: Operating Systems", "semester": 5, "credits": 4, "department": "Computer Science & Engineering", "faculty": "Dr. B. Sudarshan Reddy", "syllabus": "Process Management, Threads, Deadlocks, Memory Management, Paging, Virtual Memory, File Systems."},
    {"doc_id": "CRS_008", "course": "CS503PC: Computer Networks", "semester": 5, "credits": 3, "department": "Computer Science & Engineering", "faculty": "Dr. B. Sudarshan Reddy", "syllabus": "OSI and TCP/IP Reference Models, IP Addressing, Routing Protocols, TCP/UDP, DNS, HTTP."},
    {"doc_id": "CRS_009", "course": "DS504PC: Big Data Analytics", "semester": 5, "credits": 3, "department": "CSE - Data Science", "faculty": "Mr. K. Vamshi Krishna", "syllabus": "Hadoop Architecture, MapReduce, HDFS, Spark Core, PySpark, Data Lakes."},
    {"doc_id": "CRS_010", "course": "AI505PC: Artificial Intelligence Foundations", "semester": 5, "credits": 3, "department": "CSE - AI & ML", "faculty": "Mr. M. Naresh Kumar", "syllabus": "Search Algorithms, A*, Game Playing, Knowledge Representation, Propositional Logic, Expert Systems."},
    {"doc_id": "CRS_011", "course": "CY601PC: Cryptography and Network Security", "semester": 6, "credits": 3, "department": "CSE - Cyber Security", "faculty": "Mrs. V. Lakshmi Prasanna", "syllabus": "AES, RSA, Public Key Infrastructure, Digital Signatures, Firewalls, IPSec, TLS/SSL."},
    {"doc_id": "CRS_012", "course": "CS602PC: Compiler Design", "semester": 6, "credits": 4, "department": "Computer Science & Engineering", "faculty": "Mrs. S. Deepthi", "syllabus": "Lexical Analysis, Top-down and Bottom-up Parsing, Syntax Directed Translation, Code Optimization."},
    {"doc_id": "CRS_013", "course": "DS603PC: Data Mining and Data Warehousing", "semester": 6, "credits": 3, "department": "CSE - Data Science", "faculty": "Mrs. T. Swathi", "syllabus": "OLAP vs OLTP, Star Schema, Apriori Algorithm, FP-Growth, Clustering algorithms, K-Means."},
    {"doc_id": "CRS_014", "course": "MH301BS: Probability & Statistics for Engineers", "semester": 3, "credits": 4, "department": "Mathematics", "faculty": "Dr. C. Harish", "syllabus": "Bayes Theorem, Random Variables, Probability Distributions (Binomial, Poisson, Normal), Hypothesis Testing."},
    {"doc_id": "CRS_015", "course": "CS801PW: Major Project & Internship", "semester": 8, "credits": 10, "department": "All Branches", "faculty": "Department Project Committee", "syllabus": "Project Phase 1 Review, Implementation, Design Review, Final Thesis, Viva Voce."},
    {"doc_id": "CRS_016", "course": "CS401PC: Design and Analysis of Algorithms", "semester": 4, "credits": 4, "department": "Computer Science & Engineering", "faculty": "Dr. K. Srinivas Rao", "syllabus": "Asymptotic Notations, Divide & Conquer, Greedy Method, Dynamic Programming, Backtracking, Branch & Bound."},
    {"doc_id": "CRS_017", "course": "CS402PC: Object Oriented Programming through Java", "semester": 4, "credits": 3, "department": "Computer Science & Engineering", "faculty": "Mrs. K. Madhavi", "syllabus": "Classes, Inheritance, Polymorphism, Interfaces, Exception Handling, Multithreading, Java Streams."},
    {"doc_id": "CRS_018", "course": "DS403PC: Python for Data Science and Visualization", "semester": 4, "credits": 3, "department": "CSE - Data Science", "faculty": "Mr. K. Vamshi Krishna", "syllabus": "NumPy arrays, Pandas DataFrames, Matplotlib, Seaborn, Exploratory Data Analysis (EDA)."},
    {"doc_id": "CRS_019", "course": "IT604PE: Mobile Application Development using Flutter", "semester": 6, "credits": 3, "department": "Information Technology", "faculty": "Dr. Sandhya Rani", "syllabus": "Dart Programming, Widget Tree, State Management (Provider/Bloc), REST API Integration, Firebase."},
    {"doc_id": "CRS_020", "course": "HS706MC: Professional Ethics & Human Values", "semester": 7, "credits": 0, "department": "Humanities", "faculty": "Dr. Shalini Gupta", "syllabus": "Engineering Ethics, Moral Issues, Academic Integrity, Whistleblowing, Global Engineering Issues."}
]

# 3. Examination Schedules (20 records)
exam_data = [
    {"doc_id": "EXM_001", "subject": "Machine Learning (CS701PC)", "semester": 7, "date": "2026-11-16", "time": "10:00 AM - 01:00 PM", "venue": "Block-A & Block-B Exam Halls", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_002", "subject": "Natural Language Processing (DS702PC)", "semester": 7, "date": "2026-11-18", "time": "10:00 AM - 01:00 PM", "venue": "Block-A Exam Hall 201-205", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_003", "subject": "Cloud Computing and Virtualization (CS703PC)", "semester": 7, "date": "2026-11-20", "time": "10:00 AM - 01:00 PM", "venue": "Block-B Exam Hall 101-105", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_004", "subject": "Deep Learning & Neural Architectures (DS704PE)", "semester": 7, "date": "2026-11-23", "time": "10:00 AM - 01:00 PM", "venue": "Block-C Central Auditorium", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_005", "subject": "Full Stack Web Development (CS705PC)", "semester": 7, "date": "2026-11-25", "time": "10:00 AM - 01:00 PM", "venue": "Block-A Exam Halls 301-306", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_006", "subject": "Machine Learning Lab Practical Exam", "semester": 7, "date": "2026-12-01", "time": "09:30 AM - 12:30 PM", "venue": "Data Science Lab 1 & 2 (Block A)", "type": "External Lab Examination"},
    {"doc_id": "EXM_007", "subject": "NLP & Deep Learning Lab Practical", "semester": 7, "date": "2026-12-02", "time": "01:30 PM - 04:30 PM", "venue": "AI Innovation Lab (Block B)", "type": "External Lab Examination"},
    {"doc_id": "EXM_008", "subject": "Full Stack Development Project Lab", "semester": 7, "date": "2026-12-04", "time": "09:30 AM - 12:30 PM", "venue": "Advanced Computing Lab", "type": "External Lab Examination"},
    {"doc_id": "EXM_009", "subject": "Major Project Stage-1 Review & Viva", "semester": 7, "date": "2026-12-08", "time": "09:00 AM - 04:00 PM", "venue": "Seminar Hall 1, CSE Dept", "type": "Departmental Project Evaluation"},
    {"doc_id": "EXM_010", "subject": "Database Management Systems (CS501PC)", "semester": 5, "date": "2026-11-17", "time": "02:00 PM - 05:00 PM", "venue": "Block-B Exam Halls 201-208", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_011", "subject": "Operating Systems (CS502PC)", "semester": 5, "date": "2026-11-19", "time": "02:00 PM - 05:00 PM", "venue": "Block-B Exam Halls 201-208", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_012", "subject": "Computer Networks (CS503PC)", "semester": 5, "date": "2026-11-21", "time": "02:00 PM - 05:00 PM", "venue": "Block-B Exam Halls 201-208", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_013", "subject": "Big Data Analytics (DS504PC)", "semester": 5, "date": "2026-11-24", "time": "02:00 PM - 05:00 PM", "venue": "Block-A Exam Halls 101-106", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_014", "subject": "Artificial Intelligence Foundations (AI505PC)", "semester": 5, "date": "2026-11-26", "time": "02:00 PM - 05:00 PM", "venue": "Block-A Exam Halls 101-106", "type": "Semester End Theory Examination"},
    {"doc_id": "EXM_015", "subject": "Mid-Term Examination 1 - Odd Semester", "semester": 7, "date": "2026-09-08 to 2026-09-12", "time": "10:00 AM - 12:00 PM", "venue": "Classrooms Respective Blocks", "type": "Internal Assessment Test"},
    {"doc_id": "EXM_016", "subject": "Mid-Term Examination 2 - Odd Semester", "semester": 7, "date": "2026-11-03 to 2026-11-07", "time": "10:00 AM - 12:00 PM", "venue": "Classrooms Respective Blocks", "type": "Internal Assessment Test"},
    {"doc_id": "EXM_017", "subject": "Supply / Backlog Examination Registration", "semester": 1, "date": "2026-10-15 to 2026-10-25", "time": "Online Portal", "venue": "Examination Portal (erp.mlrit.ac.in)", "type": "Fee Payment & Registration"},
    {"doc_id": "EXM_018", "subject": "Issuance of Hall Tickets / Admit Cards", "semester": 7, "date": "2026-11-12", "time": "10:00 AM Onwards", "venue": "Student Portal & Department Office", "type": "Hall Ticket Clearance"},
    {"doc_id": "EXM_019", "subject": "Declaration of Semester End Results", "semester": 7, "date": "2026-12-30", "time": "05:00 PM", "venue": "Official Portal results.mlrit.ac.in", "type": "Result Publication"},
    {"doc_id": "EXM_020", "subject": "Recounting & Revaluation Application Window", "semester": 7, "date": "2027-01-02 to 2027-01-08", "time": "Online Portal", "venue": "Exam Branch Counters", "type": "Grievance / Revaluation"}
]

# 4. Academic Calendar (15 records)
calendar_data = [
    {"doc_id": "CAL_001", "event": "Commencement of Classwork for VII Semester (B.Tech)", "date": "2026-07-15", "description": "Beginning of VII semester academic instruction, syllabus rollout, and mentor allotment."},
    {"doc_id": "CAL_002", "event": "First Spell of Instructions (8 Weeks)", "date": "2026-07-15 to 2026-09-05", "description": "Continuous regular classes covering Units 1, 2 and half of Unit 3."},
    {"doc_id": "CAL_003", "event": "First Mid-Term Examinations", "date": "2026-09-08 to 2026-09-12", "description": "Descriptive and objective internal assessment for mid-term syllabus evaluation."},
    {"doc_id": "CAL_004", "event": "Submission of Mid-1 Marks & Parent-Teacher Meeting", "date": "2026-09-19", "description": "Faculty upload Mid-1 marks to ERP; PTM conducted for students with attendance < 75%."},
    {"doc_id": "CAL_005", "event": "Second Spell of Instructions (8 Weeks)", "date": "2026-09-15 to 2026-10-31", "description": "Completion of Units 3, 4 and 5; technical seminar deliveries."},
    {"doc_id": "CAL_006", "event": "Second Mid-Term Examinations", "date": "2026-11-03 to 2026-11-07", "description": "Second continuous internal assessment testing remaining modules."},
    {"doc_id": "CAL_007", "event": "Practical & Lab Preparation Holidays", "date": "2026-11-09 to 2026-11-14", "description": "Study holidays for students to prepare for end semester theory and practical exams."},
    {"doc_id": "CAL_008", "event": "End Semester Theory Examinations", "date": "2026-11-16 to 2026-11-28", "description": "Autonomous university semester end theory examinations for 7th semester students."},
    {"doc_id": "CAL_009", "event": "End Semester Practical / Lab Examinations", "date": "2026-11-30 to 2026-12-06", "description": "Lab practical assessments evaluated by external and internal examiners."},
    {"doc_id": "CAL_010", "event": "Major Project Stage-1 Reviews", "date": "2026-12-07 to 2026-12-10", "description": "Presentation of Project Abstract, System Architecture, RAG pipeline, and working prototype."},
    {"doc_id": "CAL_011", "event": "Winter Semester Break / Vacation", "date": "2026-12-11 to 2026-12-25", "description": "Annual winter vacation for students and winter internship period."},
    {"doc_id": "CAL_012", "event": "Commencement of VIII Semester Classwork", "date": "2026-12-28", "description": "Start of Final VIII semester; full-time industry internships and Major Project Stage-2."},
    {"doc_id": "CAL_013", "event": "Annual Technical Fest (TechFest 2026)", "date": "2026-10-08 to 2026-10-10", "description": "National level technical symposium featuring hackathons, paper presentations, and robotics."},
    {"doc_id": "CAL_014", "event": "Cultural & Sports Week (Vibrance 2026)", "date": "2026-10-22 to 2026-10-24", "description": "Inter-college cultural festivities, dance, drama, music competitions, and sports meet."},
    {"doc_id": "CAL_015", "event": "Last Date for Major Project Dissertation Submission", "date": "2027-04-15", "description": "Final date for submitting bounded thesis and code repositories for graduation."}
]

# 5. Attendance Policies (15 records)
attendance_data = [
    {"doc_id": "ATT_001", "title": "Minimum Attendance Requirement for Semester End Exams", "policy": "A student must secure a minimum aggregate attendance of 75% in all registered subjects of the current semester to be eligible to appear for the semester end examinations.", "condonation_rule": "Condonation of shortage of attendance between 65% and 74.99% may be granted by the Academic Council on genuine medical grounds upon submission of valid medical certificate.", "minimum_percentage": 75},
    {"doc_id": "ATT_002", "title": "Condonation Application and Fee Procedure", "policy": "Students securing attendance between 65% and 75% must submit an official medical condonation application signed by a Registered Medical Practitioner within 3 working days of notification. A prescribed condonation fee of Rs. 1,500 per semester is payable upon approval.", "condonation_rule": "Valid between 65% and 74.99% only. Below 65% cannot be condoned under any circumstances.", "minimum_percentage": 65},
    {"doc_id": "ATT_003", "title": "Detention Policy for Low Attendance", "policy": "Students whose overall semester attendance falls below 65% are NOT eligible to appear for semester end examinations. Such students are categorized as 'Detained for Want of Attendance' and must repeat the semester with the subsequent batch.", "condonation_rule": "No condonation allowed below 65%. Detention is strictly enforced under university academic regulations.", "minimum_percentage": 65},
    {"doc_id": "ATT_004", "title": "Subject-Wise Minimum Attendance Threshold", "policy": "In addition to aggregate attendance of 75%, students should maintain at least 60% attendance in each individual subject to ensure comprehensive understanding and avoid academic warnings.", "condonation_rule": "Individual subject deficiency below 60% triggers mandatory remedial assignments before exam clearance.", "minimum_percentage": 60},
    {"doc_id": "ATT_005", "title": "On-Duty (OD) Attendance for College Events & Sports", "policy": "Students representing the institution in university sports, hackathons, IEEE conferences, NCC/NSS camps, and approved placement drives will be awarded On-Duty (OD) attendance up to a maximum of 10% of total working days.", "condonation_rule": "OD forms must be endorsed by the Faculty Coordinator and approved by the HOD within 2 days of the event.", "minimum_percentage": 75},
    {"doc_id": "ATT_006", "title": "Biometric & Digital Attendance Tracking", "policy": "Attendance is recorded digitally at the start of each lecture via the CampusIQ portal. A grace period of 5 minutes from bell time is permitted, after which the student is marked absent.", "condonation_rule": "Late entries cannot be altered without written justification from the Head of Department.", "minimum_percentage": 75},
    {"doc_id": "ATT_007", "title": "Monthly Attendance Warning Circulars", "policy": "Attendance is reconciled on the last working day of every calendar month. Students below 75% receive First Warning SMS/email. Students below 65% receive Second Warning and their parents are called for counseling.", "condonation_rule": "Cumulative progress is reviewed by the Academic Performance Evaluation Committee.", "minimum_percentage": 75},
    {"doc_id": "ATT_008", "title": "Laboratory & Practical Attendance Rule", "policy": "A minimum of 80% attendance is mandatory in all laboratory and workshop courses to qualify for external practical examinations. 100% of lab experiments must be completed and certified in the record book.", "condonation_rule": "Missed practical sessions must be repeated during extra lab hours with prior lab-incharge permission.", "minimum_percentage": 80},
    {"doc_id": "ATT_009", "title": "Medical Leave Submission Timeline", "policy": "In case of prolonged illness or hospitalization, medical certificates along with discharge summaries, diagnostic reports, and fitness certificates must be submitted to the HOD within 3 days of resuming college.", "condonation_rule": "Medical certificates submitted at the end of semester without prior intimation will be rejected.", "minimum_percentage": 65},
    {"doc_id": "ATT_010", "title": "Attendance Weightage in Internal Assessment", "policy": "Internal assessment calculation allocates 5 marks for attendance: 90%+ (5 marks), 85-89% (4 marks), 80-84% (3 marks), 75-79% (2 marks), Below 75% (0 marks).", "condonation_rule": "Incentivizes high lecture presence throughout the semester.", "minimum_percentage": 75},
    {"doc_id": "ATT_011", "title": "Final Year Major Project Attendance", "policy": "Final year students working on major projects or industry internships must log a minimum of 75% biometric attendance on designated project days and obtain weekly sign-offs from their internal guide.", "condonation_rule": "Failure to maintain weekly guide interactions results in stage-1 review disqualification.", "minimum_percentage": 75},
    {"doc_id": "ATT_012", "title": "Elective and Open Elective Attendance", "policy": "Attendance in Professional Electives and Open Electives carries equal weightage as core subjects. Disqualification from an elective exam requires re-registration in subsequent odd/even semester.", "condonation_rule": "Elective attendance cannot be pooled or transferred between subjects.", "minimum_percentage": 75},
    {"doc_id": "ATT_013", "title": "Condonation Approving Authority", "policy": "Only the Principal and Controller of Examinations, upon recommendation by the HOD, have the authority to grant attendance condonation based on documentary proof.", "condonation_rule": "Academic committee decisions are final and binding.", "minimum_percentage": 65},
    {"doc_id": "ATT_014", "title": "Attendance Calculation Formula", "policy": "Percentage of Attendance = (Total number of periods attended by the student in all registered courses / Total number of periods conducted by the college in the semester) * 100.", "condonation_rule": "Standard mathematical rounding off to two decimal places applies.", "minimum_percentage": 75},
    {"doc_id": "ATT_015", "title": "Attendance Requirement for Placement Drives", "policy": "To be eligible to sit for on-campus and off-campus placement interviews and company registration, students must maintain a minimum of 75% attendance in the current and preceding semester.", "condonation_rule": "Students with chronic attendance shortages are debarred from Tier-1 and Tier-2 placement drives.", "minimum_percentage": 75}
]

# 6. Placement Policies (15 records)
placement_data = [
    {"doc_id": "PLC_001", "company_type": "Dream / Super Dream Companies (Tier-1: CTC > 10 LPA)", "rule": "Minimum CGPA of 7.5 or 8.0 with no history of backlogs (0 active, 0 history). 10th and 12th standard aggregate must be 75% or higher.", "eligibility_cgpa": 7.5, "allowed_backlogs": 0, "guidelines": "Students securing Tier-1 offer are out of subsequent placement drives except for Super Dream packages exceeding 20 LPA."},
    {"doc_id": "PLC_002", "company_type": "Core / Product Engineering Companies (Tier-2: CTC 6-10 LPA)", "rule": "Minimum CGPA of 6.75 or 7.0 with no active backlogs at the time of drive. Past cleared backlogs permitted up to a maximum of 2.", "eligibility_cgpa": 6.75, "allowed_backlogs": 0, "guidelines": "Technical coding test qualification is mandatory; aptitude clearance is monitored."},
    {"doc_id": "PLC_003", "company_type": "Mass Recruiters / IT Services (Tier-3: CTC 3.5 - 6.0 LPA)", "rule": "Minimum CGPA of 6.0 or 60% aggregate across all completed semesters. Maximum of 1 active backlog allowed by select recruiters like TCS, Cognizant, Wipro, Accenture.", "eligibility_cgpa": 6.0, "allowed_backlogs": 1, "guidelines": "Students must possess foundational programming skills in Java, Python, or C++ and English communication clearance."},
    {"doc_id": "PLC_004", "company_type": "One Student One Job Policy", "rule": "Once a student is placed in a company offering CTC between 3.5 to 6.5 LPA, they are eligible to attempt only for Dream / Super Dream companies offering CTC >= 2X of their current offer.", "eligibility_cgpa": 6.5, "allowed_backlogs": 0, "guidelines": "Prevents hoarding of offers and ensures equitable placement opportunities for all batchmates."},
    {"doc_id": "PLC_005", "company_type": "Mandatory Training & Assessment Attendance", "rule": "Students must achieve 85% attendance in Placement Training Soft-Skills, Quantitative Aptitude, and Mock Technical Coding bootcamps organized by the Career Development Cell.", "eligibility_cgpa": 6.0, "allowed_backlogs": 2, "guidelines": "Unexcused absence from 2 consecutive training sessions leads to debarment from 3 upcoming placement drives."},
    {"doc_id": "PLC_006", "company_type": "Placement Registration & Code of Conduct", "rule": "Registration on the CampusIQ Placement Portal is mandatory with verified marks, resume, and undertaking. Misrepresentation of CGPA or backlogs leads to permanent debarment.", "eligibility_cgpa": 6.0, "allowed_backlogs": 0, "guidelines": "Dress code is strictly formal western/business attire for all virtual and in-person interviews."},
    {"doc_id": "PLC_007", "company_type": "Internship-Cum-Placement Conversion Rules", "rule": "Students selected for 6-month VIII semester industrial internships must maintain regular communication with T&P cell and submit monthly work progress reports.", "eligibility_cgpa": 6.5, "allowed_backlogs": 0, "guidelines": "PPO (Pre-Placement Offer) conversions must be formally communicated to college within 7 working days."},
    {"doc_id": "PLC_008", "company_type": "Penalties for Offer Rejection & No-Show", "rule": "If a student registers for a company drive, clears online assessment, and fails to attend subsequent technical/HR interview without medical emergency, they are blacklisted for 2 subsequent recruitment cycles.", "eligibility_cgpa": 6.0, "allowed_backlogs": 0, "guidelines": "Respect for corporate recruiters' schedule is strictly enforced."},
    {"doc_id": "PLC_009", "company_type": "Startup & High-Growth Tech Hiring Criteria", "rule": "Minimum CGPA of 6.5, with demonstrated GitHub projects, full-stack applications, open-source contributions, or competitive programming rankings (LeetCode, CodeChef).", "eligibility_cgpa": 6.5, "allowed_backlogs": 1, "guidelines": "Practical hands-on coding skills often prioritized over theoretical marks."},
    {"doc_id": "PLC_010", "company_type": "Backlog Clearance Verification Procedure", "rule": "Students who cleared supplementary exams must obtain provisional backlog clearance certificates from the Examination Branch and update their CampusIQ placement profile immediately.", "eligibility_cgpa": 6.0, "allowed_backlogs": 0, "guidelines": "Companies do not consider backlog results awaiting revaluation as cleared."},
    {"doc_id": "PLC_011", "company_type": "Special Diversity & Women in Tech Hiring Drives", "rule": "Global tech corporations (Google WE, Amazon WOW, Adobe SheCodes) hold targeted initiatives with CGPA criterion of 7.0+ for female students.", "eligibility_cgpa": 7.0, "allowed_backlogs": 0, "guidelines": "Specialized mentorship and coding preparation sessions offered by college alumni."},
    {"doc_id": "PLC_012", "company_type": "Placement Verification Document Checklist", "rule": "Students must carry 3 hard copies of verified resume, 4 passport photos, government ID (Aadhaar/PAN), college ID, and original marks memos in a neat portfolio file.", "eligibility_cgpa": 6.0, "allowed_backlogs": 0, "guidelines": "Failure to produce documents during physical document verification causes instant rejection."},
    {"doc_id": "PLC_013", "company_type": "Higher Studies (GATE/GRE/CAT) Placement Exemption", "rule": "Students pursuing higher studies or government civil services exams can opt out of placement drives by submitting an undertaking signed by parents before the start of the 7th semester.", "eligibility_cgpa": 5.0, "allowed_backlogs": 5, "guidelines": "Exempts students from mandatory placement fee and training bootcamps."},
    {"doc_id": "PLC_014", "company_type": "Off-Campus Placement Assistance & NOC Rules", "rule": "Students securing off-campus offers can request College No-Objection Certificate (NOC) for early onboarding if they have cleared all 7 semesters with no pending subjects.", "eligibility_cgpa": 6.5, "allowed_backlogs": 0, "guidelines": "Requires submission of formal company offer letter and parent consent letter."},
    {"doc_id": "PLC_015", "company_type": "Placement Season Timeline & Companies", "rule": "Major hiring season spans August to March. Major visiting firms include Amazon, ServiceNow, Epam, Virtusa, TCS Digital, Cognizant, Wipro, Capgemini, Hexaware, and Darwinbox.", "eligibility_cgpa": 6.0, "allowed_backlogs": 0, "guidelines": "Over 75+ tech and engineering recruiters visit MLRIT campus annually."}
]

# 7. Campus Services (15 records)
services_data = [
    {"doc_id": "SRV_001", "service": "Central Library & Digital Knowledge Center", "timing": "08:00 AM - 08:00 PM (Monday to Saturday)", "location": "Block-C, Ground & First Floor", "contact": "library@mlrit.ac.in, Ext: 301", "details": "Access to 50,000+ volumes, IEEE Xplore, ScienceDirect, Springer journals, Delnet, and 60 high-speed digital research terminals."},
    {"doc_id": "SRV_002", "service": "Health Center & Medical Dispensary", "timing": "24/7 On-Call, OPD: 09:00 AM - 06:00 PM", "location": "Hostel Block A Ground Floor", "contact": "health@mlrit.ac.in, 9848022331", "details": "Resident medical officer, female nursing staff, emergency ambulance service, basic diagnostics, and complimentary first aid medications."},
    {"doc_id": "SRV_003", "service": "Campus Cafeteria & Food Court", "timing": "08:00 AM - 07:30 PM Everyday", "location": "Near Sports Complex", "contact": "cafeteria@mlrit.ac.in", "details": "Hygienic vegetarian and non-vegetarian meals, South Indian breakfast, fruit juices, snack counters, and Nescafe kiosk."},
    {"doc_id": "SRV_004", "service": "Student Transport & College Buses", "timing": "Morning arrival: 08:45 AM, Evening departure: 04:15 PM & 05:45 PM", "location": "Bus Bay & Parking Area", "contact": "transport@mlrit.ac.in, 9848022340", "details": "Fleet of 65 GPS-enabled AC and non-AC buses covering all prime zones of Hyderabad and Secunderabad."},
    {"doc_id": "SRV_005", "service": "Career Development & Training Cell", "timing": "09:00 AM - 05:00 PM", "location": "Placement Block, 2nd Floor", "contact": "placements@mlrit.ac.in, Ext: 405", "details": "Aptitude training, resume building labs, technical mock interviews, and corporate recruiter hospitality."},
    {"doc_id": "SRV_006", "service": "Indoor Sports Complex & Gymnasium", "timing": "06:00 AM - 08:30 AM & 04:30 PM - 07:30 PM", "location": "Sports Arena Building", "contact": "sports@mlrit.ac.in", "details": "Modern fitness gym with trainers, 4 badminton wooden courts, table tennis tables, chess and carrom lounges."},
    {"doc_id": "SRV_007", "service": "Outdoor Athletic Grounds & Cricket Stadium", "timing": "06:00 AM - 06:30 PM", "location": "Main Athletic Field", "contact": "physicaldirector@mlrit.ac.in", "details": "Standard 400m running track, cricket turf pitch, basketball court, volleyball court, and football arena."},
    {"doc_id": "SRV_008", "service": "ERP & IT Helpdesk", "timing": "09:00 AM - 04:30 PM", "location": "Admin Block, Room 104", "contact": "erphelp@mlrit.ac.in", "details": "Assistance with student portal login issues, fee payment receipts, ID card printing, and email password resets."},
    {"doc_id": "SRV_009", "service": "Campus Wi-Fi & Internet Infrastructure", "timing": "24/7 Active", "location": "Whole Campus & Hostels", "contact": "networkadmin@mlrit.ac.in", "details": "1 Gbps high-speed optical fiber backbone with seamless Wi-Fi roaming across all academic blocks and hostels."},
    {"doc_id": "SRV_010", "service": "Bank Extension Counter & 24/7 ATM", "timing": "Banking: 10:00 AM - 03:30 PM, ATM: 24 Hours", "location": "Near Campus Main Gate", "contact": "Union Bank MLRIT Branch", "details": "Union Bank of India full-fledged branch, fee challan processing, educational loan counseling, and 24-hour ATM."},
    {"doc_id": "SRV_011", "service": "Student Counseling & Mental Well-being Cell", "timing": "02:00 PM - 05:00 PM (Confidential)", "location": "Block-B, Room 308", "contact": "counselor@mlrit.ac.in", "details": "Licensed psychological counselor offering stress relief, exam anxiety management, and personal counseling with complete privacy."},
    {"doc_id": "SRV_012", "service": "Stationery Store & Reprographic Center", "timing": "08:30 AM - 06:00 PM", "location": "Opposite Central Library", "contact": "store@mlrit.ac.in", "details": "Photocopying, spiral binding, engineering drawing instruments, project report binding, and textbooks."},
    {"doc_id": "SRV_013", "service": "Robotics & Innovation Incubation Center", "timing": "09:00 AM - 08:00 PM", "location": "Block-D 3rd Floor", "contact": "incubation@mlrit.ac.in", "details": "3D printers, IoT hardware kits, Arduino/Raspberry Pi boards, startup mentoring, and seed funding support."},
    {"doc_id": "SRV_014", "service": "Women Protection & Anti-Sexual Harassment Cell", "timing": "24/7 Helpline: 9848022350", "location": "Block-A Room 112", "contact": "womenprotection@mlrit.ac.in", "details": "Dedicated grievance redressal cell for female students and staff ensuring a secure, supportive, and harassment-free environment."},
    {"doc_id": "SRV_015", "service": "Alumni Relations & Networking Lounge", "timing": "10:00 AM - 04:00 PM", "location": "Admin Block 2nd Floor", "contact": "alumni@mlrit.ac.in", "details": "Connects existing students with global alumni for mentorship, career advice, mock interviews, and scholarship opportunities."}
]

# 8. Holidays (15 records)
holidays_data = [
    {"doc_id": "HOL_001", "holiday": "Independence Day", "date": "2026-08-15", "type": "National Holiday", "remarks": "Flag hoisting ceremony at 08:00 AM in front of Main Administrative Block."},
    {"doc_id": "HOL_002", "holiday": "Vinayaka Chavithi (Ganesh Chaturthi)", "date": "2026-09-04", "type": "Public Festival", "remarks": "College and academic offices remain closed."},
    {"doc_id": "HOL_003", "holiday": "Milad-un-Nabi", "date": "2026-09-16", "type": "Public Holiday", "remarks": "Gazetted holiday as per Telangana State Government."},
    {"doc_id": "HOL_004", "holiday": "Mahatma Gandhi Jayanti", "date": "2026-10-02", "type": "National Holiday", "remarks": "Swachh Bharat cleanliness drive organized by NSS volunteers."},
    {"doc_id": "HOL_005", "holiday": "Bathukamma & Dussehra Vacation", "date": "2026-10-12 to 2026-10-18", "type": "Festival Vacation", "remarks": "One week mid-semester vacation for students and faculty."},
    {"doc_id": "HOL_006", "holiday": "Deepavali (Diwali)", "date": "2026-11-01", "type": "Public Festival", "remarks": "Festival of lights; hostel residents provided special festive dinner."},
    {"doc_id": "HOL_007", "holiday": "Kartika Purnima / Guru Nanak Jayanti", "date": "2026-11-15", "type": "Public Holiday", "remarks": "Optional holiday for administrative staff."},
    {"doc_id": "HOL_008", "holiday": "Christmas Holiday", "date": "2026-12-25", "type": "Public Festival", "remarks": "Winter vacation overlaps with Christmas celebrations."},
    {"doc_id": "HOL_009", "holiday": "New Year Day", "date": "2027-01-01", "type": "General Holiday", "remarks": "Welcoming the new academic calendar year 2027."},
    {"doc_id": "HOL_010", "holiday": "Sankranti / Pongal Vacation", "date": "2027-01-13 to 2027-01-17", "type": "Festival Vacation", "remarks": "Traditional harvest festival break for students."},
    {"doc_id": "HOL_011", "holiday": "Republic Day", "date": "2027-01-26", "type": "National Holiday", "remarks": "Ceremonial parade and address by College Principal and Management."},
    {"doc_id": "HOL_012", "holiday": "Maha Shivaratri", "date": "2027-02-18", "type": "Public Festival", "remarks": "College and examination branch closed."},
    {"doc_id": "HOL_013", "holiday": "Holi Festival", "date": "2027-03-15", "type": "Public Festival", "remarks": "Festival of colors; college holiday."},
    {"doc_id": "HOL_014", "holiday": "Ugadi (Telugu New Year)", "date": "2027-03-30", "type": "State Festival", "remarks": "Traditional Telugu New Year festival holiday."},
    {"doc_id": "HOL_015", "holiday": "Eid-ul-Fitr (Ramzan)", "date": "2027-04-10", "type": "Public Festival", "remarks": "Subject to the sighting of the moon."}
]

# 9. Hostel Information (20 records)
hostel_data = [
    {"doc_id": "HST_001", "rule": "Hostel In-Time and Curfew Timings", "timings": "08:30 PM for Boys Hostel, 07:00 PM for Girls Hostel", "mess_schedule": "Breakfast: 7:30-9:00 AM, Lunch: 12:30-2:00 PM, Dinner: 7:30-9:00 PM", "warden_contact": "Chief Warden: 9848022360, Girls Hostel: 9848022365", "discipline": "Biometric entry strictly monitored. Late entry after curfew without prior warden permission incurs a fine of Rs. 500."},
    {"doc_id": "HST_002", "rule": "Hostel Room Allocation and Furniture Maintenance", "timings": "Annual allocation during July semester registration", "mess_schedule": "Standard 3-sharing and 2-sharing rooms", "warden_contact": "Block Warden: Ext 210", "discipline": "Students are responsible for furniture, fan, tube light, and cupboard allocated to them. Willful damage leads to recovery costs plus penalty."},
    {"doc_id": "HST_003", "rule": "Mess Menu and Hygiene Regulations", "timings": "7 Days a week with rotating multi-cuisine menu", "mess_schedule": "4 meals per day including evening tea and snacks at 05:00 PM", "warden_contact": "Mess Supervisor: 9848022370", "discipline": "Food wastage is strictly discouraged. Taking mess utensils or food plates to hostel rooms is strictly prohibited."},
    {"doc_id": "HST_004", "rule": "Hostel Out-Pass and Leave Application Procedure", "timings": "Out-pass requests must be applied 24 hours in advance via CampusIQ", "mess_schedule": "Regular hours", "warden_contact": "Wardens Desk Room 101", "discipline": "Weekend home passes require SMS/telephonic confirmation from registered parent mobile number before gate clearance is issued."},
    {"doc_id": "HST_005", "rule": "Zero Tolerance Against Ragging in Hostels", "timings": "24/7 Anti-Ragging Flying Squad Active", "mess_schedule": "N/A", "warden_contact": "Anti-Ragging Helpline: 1800-180-5522, Warden Mobile: 9848022360", "discipline": "Any form of ragging, harassment, or intimidation results in immediate expulsion from college and police FIR under Telangana Prohibition of Ragging Act."},
    {"doc_id": "HST_006", "rule": "Prohibition of Electrical Appliances", "timings": "Continuous room inspections", "mess_schedule": "N/A", "warden_contact": "Hostel Electrician: Ext 215", "discipline": "Use of high-power immersion heaters, electric stoves, induction cookers, and irons in rooms is banned due to fire safety hazards."},
    {"doc_id": "HST_007", "rule": "Visitor and Day-Scholar Policy in Hostels", "timings": "Visitor hours: 04:30 PM - 06:30 PM on Sundays only", "mess_schedule": "Guest coupons available at mess counter", "warden_contact": "Hostel Security In-charge", "discipline": "Day-scholar students and unauthorized external guests are strictly forbidden from entering hostel rooms. Violation results in disciplinary action."},
    {"doc_id": "HST_008", "rule": "Hostel Wi-Fi and Silent Study Hours", "timings": "Wi-Fi: 24/7, Study hours: 09:30 PM - 11:30 PM", "mess_schedule": "Night canteen open till 11:00 PM", "warden_contact": "Network Support: Ext 108", "discipline": "Playing loud music, shouting, or creating disturbances during designated silent study hours is penalized."},
    {"doc_id": "HST_009", "rule": "Hostel Medical Emergency Support", "timings": "24/7 Ambulance available on campus", "mess_schedule": "Dietary sick meals provided upon request", "warden_contact": "Health Center Doctor: 9848022331", "discipline": "Any medical illness or sudden fever must be reported to floor supervisor immediately for prompt medical attention."},
    {"doc_id": "HST_010", "rule": "Hostel Fee Payment & Refund Guidelines", "timings": "Annual fee payment in single or two installments", "mess_schedule": "Mess fee calculated on dividing system", "warden_contact": "Hostel Accounts Office: Ext 205", "discipline": "Hostel admission is valid for one academic year. Mid-year vacating does not entitle refund of room rent except caution deposit."},
    {"doc_id": "HST_011", "rule": "Drinking, Smoking and Substance Abuse Prohibition", "timings": "Zero tolerance 24/7", "mess_schedule": "N/A", "warden_contact": "Disciplinary Committee: 9848022360", "discipline": "Possession or consumption of alcohol, tobacco, e-cigarettes, or contraband substances leads to instant expulsion from hostel and academic suspension."},
    {"doc_id": "HST_012", "rule": "Laundry & Washing Machine Facilities", "timings": "06:00 AM - 09:00 PM Everyday", "mess_schedule": "N/A", "warden_contact": "Hostel Caretaker: Room 102", "discipline": "Commercial coin/token operated washing machines available on each floor. Professional laundry pickup twice a week."},
    {"doc_id": "HST_013", "rule": "Hostel Gym and Recreation Common Rooms", "timings": "05:30 AM - 08:00 AM and 05:00 PM - 08:00 PM", "mess_schedule": "N/A", "warden_contact": "Sports Representative", "discipline": "Recreation hall equipped with LED TV, satellite channels, carrom, table tennis, and daily newspapers in English and Telugu."},
    {"doc_id": "HST_014", "rule": "Hostel Room Cleaning and Housekeeping", "timings": "Daily floor sweeping, weekly deep cleaning", "mess_schedule": "N/A", "warden_contact": "Housekeeping Supervisor", "discipline": "Students must keep their rooms tidy and allow housekeeping staff to perform routine cleaning during morning hours."},
    {"doc_id": "HST_015", "rule": "Hostel Night Study Hall Access", "timings": "Open until 02:00 AM during examination weeks", "mess_schedule": "Late night tea/coffee counter available", "warden_contact": "Library In-charge", "discipline": "Air-conditioned common study halls available on 1st and 3rd floors for late-night exam revisions in silence."},
    {"doc_id": "HST_016", "rule": "Hostel Security and CCTV Surveillance", "timings": "24/7 Security guards and perimeter cameras", "mess_schedule": "N/A", "warden_contact": "Chief Security Officer", "discipline": "Corridors, entry gates, and common areas are monitored by CCTV for student safety. Tampering with cameras is a severe offense."},
    {"doc_id": "HST_017", "rule": "Valuables and Cash Custody", "timings": "Always", "mess_schedule": "N/A", "warden_contact": "Wardens Office", "discipline": "Students are strongly advised not to keep large amounts of cash or expensive gold jewelry in rooms. College is not liable for personal theft."},
    {"doc_id": "HST_018", "rule": "Hostel Grievance and Suggestion Box", "timings": "Weekly committee review every Saturday", "mess_schedule": "N/A", "warden_contact": "Student Hostel Representative", "discipline": "Grievances regarding mess quality, plumbing, or electrical issues can be submitted directly via CampusIQ Grievance portal."},
    {"doc_id": "HST_019", "rule": "Vacation Luggage Storage Facility", "timings": "End of semester break", "mess_schedule": "N/A", "warden_contact": "Hostel Storekeeper", "discipline": "Students going home for summer/winter breaks can store labeled trunks in the central luggage cloak room under lock and key."},
    {"doc_id": "HST_020", "rule": "Hostel Vehicle Parking Regulations", "timings": "Day and night parking in designated bays", "mess_schedule": "N/A", "warden_contact": "Security Gate 2", "discipline": "Two-wheelers must have college security sticker pass and helmet is mandatory for entry. Rash driving inside campus is banned."}
]

# 10. FAQs (30 records)
faq_data = [
    {"doc_id": "FAQ_001", "question": "What is the minimum attendance required to appear for semester examinations?", "answer": "Students must have an overall aggregate attendance of at least 75% across all registered theory and lab subjects in the semester to be eligible for semester end examinations.", "category": "Attendance"},
    {"doc_id": "FAQ_002", "question": "Can shortage of attendance be condoned, and what is the condonation range?", "answer": "Yes, attendance shortage between 65% and 74.99% can be condoned by the Academic Council on genuine medical grounds upon submission of valid medical documents and payment of Rs. 1,500 condonation fee.", "category": "Attendance"},
    {"doc_id": "FAQ_003", "question": "What happens if my attendance is below 65%?", "answer": "Students with aggregate attendance below 65% are detained for want of attendance, cannot write semester end examinations, and must repeat the semester with the subsequent batch.", "category": "Attendance"},
    {"doc_id": "FAQ_004", "question": "What are the placement eligibility criteria for Tier-1 Dream companies?", "answer": "Tier-1 Dream companies (CTC > 10 LPA) generally require a minimum CGPA of 7.5 to 8.0, 75%+ in 10th and 12th standards, and zero active or historical backlogs.", "category": "Placement"},
    {"doc_id": "FAQ_005", "question": "What is the minimum CGPA required for mass recruiters and IT services companies?", "answer": "Most mass recruitment companies (TCS, Wipro, Infosys, Cognizant, Accenture) require a minimum CGPA of 6.0 or 60% with up to 1 active backlog permitted by select recruiters.", "category": "Placement"},
    {"doc_id": "FAQ_006", "question": "What is the university policy on one student getting multiple job offers?", "answer": "Under the One Student One Job policy, once placed in a regular tier company (3.5-6.5 LPA), a student can only apply for Dream or Super Dream offers providing at least 2X of their current compensation.", "category": "Placement"},
    {"doc_id": "FAQ_007", "question": "When are the 7th semester end examinations scheduled?", "answer": "The VII semester end theory examinations are scheduled from November 16, 2026 to November 28, 2026. Lab practical examinations commence from November 30, 2026.", "category": "Examinations"},
    {"doc_id": "FAQ_008", "question": "How can I apply for supply or backlog examinations?", "answer": "Students can register for backlog and supplementary exams through the student ERP portal (erp.mlrit.ac.in) by selecting backlog subjects and paying the prescribed fee within the notification window.", "category": "Examinations"},
    {"doc_id": "FAQ_009", "question": "How are internal assessment marks calculated in autonomous regulation?", "answer": "Internal assessment consists of two mid-term examinations. The final internal marks (30/40 marks) are computed giving 75% weightage to the best mid-term and 25% weightage to the other mid-term, plus continuous assignment scores.", "category": "Academics"},
    {"doc_id": "FAQ_010", "question": "How do I submit an academic or facility grievance in CampusIQ?", "answer": "Log in to CampusIQ, navigate to the Grievances tab, select your category (Academic, Attendance, Examination, Hostel, Infrastructure), fill in details, attach supporting proof if applicable, and click Submit.", "category": "Grievance"},
    {"doc_id": "FAQ_011", "question": "What is the grading scale and SGPA to percentage conversion formula?", "answer": "The university follows a 10-point grading scale: O (10), A+ (9), A (8), B+ (7), B (6), C (5), F (0). Equivalent Percentage = (CGPA - 0.75) * 10 or CGPA * 10 depending on autonomous regulation guidelines.", "category": "Academics"},
    {"doc_id": "FAQ_012", "question": "What are the library timings and book borrowing rules?", "answer": "The Central Library is open from 08:00 AM to 08:00 PM Monday through Saturday. Undergraduate students can borrow up to 4 books for a duration of 14 days, renewable once.", "category": "Campus Services"},
    {"doc_id": "FAQ_013", "question": "What should I do if I fall ill during semester classes or examinations?", "answer": "Visit the Campus Health Center or a registered hospital, notify your departmental faculty mentor within 3 days, and submit a medical fitness certificate and diagnostic reports to the HOD upon recovery.", "category": "Attendance"},
    {"doc_id": "FAQ_014", "question": "What are the curfew hours for college hostels?", "answer": "Hostel in-time is strictly 08:30 PM for boys hostel and 07:00 PM for girls hostel. Biometric logging is enforced at the hostel entry gate.", "category": "Hostel"},
    {"doc_id": "FAQ_015", "question": "How do I get an On-Duty (OD) attendance certificate for attending a hackathon?", "answer": "Fill the OD application form on CampusIQ, get it endorsed with your participation certificate by the Faculty Coordinator, and submit to the HOD within 2 working days after the event.", "category": "Attendance"},
    {"doc_id": "FAQ_016", "question": "Where can I download my examination hall ticket / admit card?", "answer": "Hall tickets are released 4 days before exams on the CampusIQ / ERP portal under the Examinations section once departmental fee and attendance clearances are completed.", "category": "Examinations"},
    {"doc_id": "FAQ_017", "question": "What are the passing marks criteria for theory and practical courses?", "answer": "A student must secure a minimum of 35% in the semester end exam and an aggregate of 40% combining continuous internal assessment and semester end examination marks to pass a course.", "category": "Academics"},
    {"doc_id": "FAQ_018", "question": "Who is the Assistant Professor guiding the Major Project A20 team?", "answer": "Mrs. Arshiya Begum, Assistant Professor, Department of Computer Science & Engineering - Data Science, MLRIT.", "category": "Faculty"},
    {"doc_id": "FAQ_019", "question": "What is CampusIQ and what are its key modules?", "answer": "CampusIQ is an AI-powered university support platform featuring RAG-based institutional document Q&A, personalized student attendance and placement eligibility analytics, and centralized administrative management.", "category": "CampusIQ"},
    {"doc_id": "FAQ_020", "question": "How can I check if I am eligible for upcoming campus placement drives?", "answer": "Open CampusIQ, navigate to the Placements tab. The system analyzes your real-time CGPA, active backlogs, and attendance against company criteria and provides clear eligibility indicators.", "category": "Placement"},
    {"doc_id": "FAQ_021", "question": "Can I apply for revaluation or recounting if I am not satisfied with my grades?", "answer": "Yes, revaluation applications open within 7 days of result declaration. Students can apply via the examination portal by paying a fee of Rs. 1,000 per subject.", "category": "Examinations"},
    {"doc_id": "FAQ_022", "question": "What bus routes are operated by the college transport department?", "answer": "College operates 65 routes covering Kukatpally, Miyapur, Secunderabad, ECIL, Dilsukhnagar, LB Nagar, Mehdipatnam, and Medchal with GPS real-time tracking.", "category": "Campus Services"},
    {"doc_id": "FAQ_023", "question": "Are electronic gadgets and smartwatches permitted in exam halls?", "answer": "No. Mobile phones, smart watches, programmable calculators, and Bluetooth devices are strictly prohibited inside the examination halls. Possession attracts malpractice penalties.", "category": "Examinations"},
    {"doc_id": "FAQ_024", "question": "What is the policy for students with active backlogs during campus placements?", "answer": "Students with active backlogs are ineligible for Tier-1 and Tier-2 companies. A few mass hiring firms allow up to 1 backlog subject to clearing before joining.", "category": "Placement"},
    {"doc_id": "FAQ_025", "question": "How do I reset my student portal or Wi-Fi password?", "answer": "Visit the ERP & IT Helpdesk in Admin Block Room 104 or submit an IT Support request through the CampusIQ Grievance section with your roll number and college ID.", "category": "Campus Services"},
    {"doc_id": "FAQ_026", "question": "What are the college working hours and class timetable schedule?", "answer": "Regular classes operate from 09:10 AM to 04:00 PM, Monday through Saturday (except 2nd and 4th Saturdays which are holidays). Each lecture is 50 minutes.", "category": "Academics"},
    {"doc_id": "FAQ_027", "question": "How does CampusIQ ensure that AI responses are factually accurate?", "answer": "CampusIQ uses Retrieval-Augmented Generation (RAG) that strictly grounds answers in verified institutional circulars, regulations, and schedules, providing exact source citations and document names.", "category": "CampusIQ"},
    {"doc_id": "FAQ_028", "question": "What financial aid and scholarships are available for students?", "answer": "Eligible students can avail Telangana State e-PASS fee reimbursement, National Scholarship Portal (NSP) schemes, and MLRIT Merit Scholarships for university rank holders.", "category": "Campus Services"},
    {"doc_id": "FAQ_029", "question": "Where is the college sports complex located and what are the gym hours?", "answer": "The Sports Complex is located next to the main athletic ground. The gym is open 06:00 AM - 08:30 AM in the morning and 04:30 PM - 07:30 PM in the evening.", "category": "Campus Services"},
    {"doc_id": "FAQ_030", "question": "What is the minimum CGPA required to graduate with B.Tech Honours or Minor degree?", "answer": "Students must maintain a CGPA of 7.5 or above with zero backlogs and complete 18 additional credits through approved MOOCs/NPTEL courses across semesters 4 to 7.", "category": "Academics"}
]

# Write all 10 JSON files
data_mapping = {
    "faculty_information.json": faculty_data,
    "course_information.json": course_data,
    "examination_schedules.json": exam_data,
    "academic_calendar.json": calendar_data,
    "attendance_policies.json": attendance_data,
    "placement_policies.json": placement_data,
    "campus_services.json": services_data,
    "holidays.json": holidays_data,
    "hostel_information.json": hostel_data,
    "faqs.json": faq_data
}

total_records = 0
for filename, records in data_mapping.items():
    path = os.path.join(base_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    total_records += len(records)
    print(f"Saved {filename}: {len(records)} records")

print(f"Total Knowledge Base records created across 10 JSON files: {total_records}")

# Generate 110 labelled training queries (query_id, query, document_id)
training_queries = [
    # Attendance queries
    ("TRN_001", "What is the minimum attendance required for semester examinations?", "ATT_001"),
    ("TRN_002", "Explain the attendance condonation policy and fees", "ATT_002"),
    ("TRN_003", "What happens if my attendance drops below 65 percent?", "ATT_003"),
    ("TRN_004", "What is the subject wise attendance threshold?", "ATT_004"),
    ("TRN_005", "How to get on-duty attendance for hackathons and sports?", "ATT_005"),
    ("TRN_006", "Is biometric attendance mandatory in college?", "ATT_006"),
    ("TRN_007", "When are monthly attendance warnings sent to parents?", "ATT_007"),
    ("TRN_008", "What is the laboratory and practical attendance requirement?", "ATT_008"),
    ("TRN_009", "Within how many days should medical certificates be submitted?", "ATT_009"),
    ("TRN_010", "How many marks are awarded for attendance in internal assessment?", "ATT_010"),
    ("TRN_011", "What is the attendance rule for final year major project?", "ATT_011"),
    ("TRN_012", "Can attendance be condoned below 65%?", "ATT_003"),
    ("TRN_013", "Who has the authority to approve attendance condonation?", "ATT_013"),
    ("TRN_014", "What is the formula to calculate semester attendance?", "ATT_014"),
    ("TRN_015", "Does attendance affect placement eligibility?", "ATT_015"),
    # Placement queries
    ("TRN_016", "What are the placement eligibility criteria for Tier-1 companies?", "PLC_001"),
    ("TRN_017", "What is the minimum CGPA required for dream placement companies?", "PLC_001"),
    ("TRN_018", "What is the eligibility for core and product engineering companies?", "PLC_002"),
    ("TRN_019", "Can students with backlogs sit for mass recruiters?", "PLC_003"),
    ("TRN_020", "What is the CGPA required for TCS and Cognizant placement?", "PLC_003"),
    ("TRN_021", "Explain the One Student One Job placement policy", "PLC_004"),
    ("TRN_022", "What is the mandatory attendance for placement training bootcamps?", "PLC_005"),
    ("TRN_023", "What happens if someone submits false CGPA for placements?", "PLC_006"),
    ("TRN_024", "What are the rules for 8th semester internship conversion?", "PLC_007"),
    ("TRN_025", "What is the penalty for missing a registered placement interview?", "PLC_008"),
    ("TRN_026", "Are GitHub projects required for startup hiring?", "PLC_009"),
    ("TRN_027", "How to update cleared backlogs for placement drives?", "PLC_010"),
    ("TRN_028", "Are there special placement drives for women in tech?", "PLC_011"),
    ("TRN_029", "What documents should I carry for campus interview drives?", "PLC_012"),
    ("TRN_030", "How to opt out of placements for higher studies GATE or GRE?", "PLC_013"),
    ("TRN_031", "How can I obtain an NOC for off-campus placement offer?", "PLC_014"),
    ("TRN_032", "Which companies visit MLRIT for campus placements?", "PLC_015"),
    # Examination queries
    ("TRN_033", "When do 7th semester end theory examinations start?", "EXM_001"),
    ("TRN_034", "What is the exam date for Machine Learning CS701PC?", "EXM_001"),
    ("TRN_035", "What is the exam date and timing for Natural Language Processing?", "EXM_002"),
    ("TRN_036", "When is the Cloud Computing theory examination?", "EXM_003"),
    ("TRN_037", "What is the date for Deep Learning elective exam?", "EXM_004"),
    ("TRN_038", "When is the Full Stack Web Development theory exam?", "EXM_005"),
    ("TRN_039", "When are the practical lab examinations scheduled?", "EXM_006"),
    ("TRN_040", "When is the NLP practical lab exam?", "EXM_007"),
    ("TRN_041", "When is the Major Project stage 1 evaluation review?", "EXM_009"),
    ("TRN_042", "When is the 5th semester DBMS examination?", "EXM_010"),
    ("TRN_043", "What is the timing for semester end exams?", "EXM_001"),
    ("TRN_044", "When will exam hall tickets be issued?", "EXM_018"),
    ("TRN_045", "When are semester end examination results announced?", "EXM_019"),
    ("TRN_046", "How do I apply for recounting or revaluation of marks?", "EXM_020"),
    ("TRN_047", "What is the deadline for supplementary exam registration?", "EXM_017"),
    # Course queries
    ("TRN_048", "What is the course syllabus for Machine Learning?", "CRS_001"),
    ("TRN_049", "Who teaches the Natural Language Processing subject?", "CRS_002"),
    ("TRN_050", "How many credits are awarded for Cloud Computing CS703PC?", "CRS_003"),
    ("TRN_051", "What topics are covered in Deep Learning neural architectures?", "CRS_004"),
    ("TRN_052", "What is taught in Full Stack Web Development course?", "CRS_005"),
    ("TRN_053", "Who is the faculty for Database Management Systems?", "CRS_006"),
    ("TRN_054", "What are the topics in Operating Systems CS502PC?", "CRS_007"),
    ("TRN_055", "What is the syllabus of Big Data Analytics course?", "CRS_009"),
    ("TRN_056", "How many credits is Major Project in semester 8?", "CRS_015"),
    ("TRN_057", "What is the syllabus for Cryptography and Network Security?", "CRS_011"),
    ("TRN_058", "Who is the course instructor for Compiler Design?", "CRS_012"),
    ("TRN_059", "What is taught in Data Mining and Data Warehousing?", "CRS_013"),
    ("TRN_060", "Is Professional Ethics a credit course or mandatory non-credit course?", "CRS_020"),
    # Faculty queries
    ("TRN_061", "Who is Mrs. Arshiya Begum and what subjects does she teach?", "FAC_001"),
    ("TRN_062", "Who is the Head of Department for Computer Science & Engineering?", "FAC_002"),
    ("TRN_063", "What is the email address of Dr. K. Srinivas Rao?", "FAC_002"),
    ("TRN_064", "Who is the professor teaching Database Systems?", "FAC_003"),
    ("TRN_065", "Which faculty teaches Deep Learning in Data Science dept?", "FAC_004"),
    ("TRN_066", "Who handles Artificial Intelligence in AI and ML department?", "FAC_005"),
    ("TRN_067", "Who is the Cyber Security faculty teaching Cryptography?", "FAC_007"),
    ("TRN_068", "Who is the Dean of Career Development and Placements?", "FAC_014"),
    ("TRN_069", "Who is the Controller of Examinations at MLRIT?", "FAC_025"),
    ("TRN_070", "What is the contact email for placement cell?", "FAC_014"),
    # Calendar queries
    ("TRN_071", "When did classwork commence for 7th semester?", "CAL_001"),
    ("TRN_072", "When are the first mid-term examinations scheduled?", "CAL_003"),
    ("TRN_073", "When is the parent teacher meeting after mid-1?", "CAL_004"),
    ("TRN_074", "When are the second mid-term examinations?", "CAL_006"),
    ("TRN_075", "When are study preparation holidays for lab exams?", "CAL_007"),
    ("TRN_076", "When does winter vacation break start?", "CAL_011"),
    ("TRN_077", "When will 8th semester classes commence?", "CAL_012"),
    ("TRN_078", "When is the annual college technical fest TechFest?", "CAL_013"),
    ("TRN_079", "When is the Vibrance cultural and sports week?", "CAL_014"),
    ("TRN_080", "What is the final deadline for project thesis submission?", "CAL_015"),
    # Services queries
    ("TRN_081", "What are the timings of the Central Library?", "SRV_001"),
    ("TRN_082", "Does college have 24/7 medical and dispensary services?", "SRV_002"),
    ("TRN_083", "What are the campus cafeteria timings?", "SRV_003"),
    ("TRN_084", "How many college buses operate and what are the departure times?", "SRV_004"),
    ("TRN_085", "What facilities are in the indoor sports complex and gym?", "SRV_006"),
    ("TRN_086", "Where is the ERP IT helpdesk located?", "SRV_008"),
    ("TRN_087", "What is the internet and Wi-Fi speed on campus?", "SRV_009"),
    ("TRN_088", "Is there a bank branch and ATM inside the campus?", "SRV_010"),
    ("TRN_089", "Is there a confidential student counseling service?", "SRV_011"),
    ("TRN_090", "Where can I get project reports printed and spiral bound?", "SRV_012"),
    ("TRN_091", "What hardware is available at the Robotics and Innovation center?", "SRV_013"),
    ("TRN_092", "What is the contact number for women protection cell?", "SRV_014"),
    # Hostel queries
    ("TRN_093", "What is the curfew time for boys and girls hostel?", "HST_001"),
    ("TRN_094", "What are the hostel mess timings for breakfast lunch and dinner?", "HST_001"),
    ("TRN_095", "What is the procedure for obtaining a weekend hostel out-pass?", "HST_004"),
    ("TRN_096", "What is the college anti-ragging helpline number?", "HST_005"),
    ("TRN_097", "Are electric kettles and heaters allowed in hostel rooms?", "HST_006"),
    ("TRN_098", "Can day scholars enter hostel rooms?", "HST_007"),
    ("TRN_099", "What are silent study hours in hostel?", "HST_008"),
    ("TRN_100", "What is the penalty for alcohol or smoking in hostel?", "HST_011"),
    ("TRN_101", "Are washing machines available in the hostel?", "HST_012"),
    ("TRN_102", "Is there a night study hall during examinations in hostel?", "HST_015"),
    # FAQ queries
    ("TRN_103", "What is the SGPA to percentage conversion formula?", "FAQ_011"),
    ("TRN_104", "How to submit an academic grievance?", "FAQ_010"),
    ("TRN_105", "What are the passing marks criteria for theory courses?", "FAQ_017"),
    ("TRN_106", "Who is guiding the CampusIQ major project team?", "FAQ_018"),
    ("TRN_107", "Are smartwatches permitted in exam halls?", "FAQ_023"),
    ("TRN_108", "What is the minimum CGPA required to graduate with Honours?", "FAQ_030"),
    ("TRN_109", "How does CampusIQ prevent hallucinating fake policies?", "FAQ_027"),
    ("TRN_110", "What scholarships are available for engineering students?", "FAQ_028")
]

# Write training queries CSV
train_csv_path = os.path.join(base_dir, "training_queries.csv")
with open(train_csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["query_id", "query", "document_id"])
    for row in training_queries:
        writer.writerow(row)
print(f"Saved training_queries.csv: {len(training_queries)} queries")

# Generate 50 test queries (query_id, query)
test_queries = [
    ("TST_001", "What is the minimum attendance required for semester examinations?"),
    ("TST_002", "What are the placement eligibility criteria for Tier-1 companies?"),
    ("TST_003", "When are the upcoming examinations for 7th semester?"),
    ("TST_004", "Explain the university attendance condonation policy."),
    ("TST_005", "What is the minimum CGPA required for placements?"),
    ("TST_006", "What happens if a student has an attendance of 68 percent?"),
    ("TST_007", "Can I sit for placements if I have one active backlog?"),
    ("TST_008", "When is the Machine Learning semester end exam scheduled?"),
    ("TST_009", "Who is the Assistant Professor guiding project A20?"),
    ("TST_010", "What is the curfew timing for girls hostel and boys hostel?"),
    ("TST_011", "How do I apply for an On-Duty attendance certificate?"),
    ("TST_012", "What is the One Student One Job placement policy?"),
    ("TST_013", "When does the Dussehra vacation start in the academic calendar?"),
    ("TRN_014", "What are the opening and closing hours of the central library?"),
    ("TST_015", "How many credits are required for the Major Project in 8th semester?"),
    ("TST_016", "What is the detention rule for attendance below 65 percent?"),
    ("TST_017", "What are the rules for submitting a student grievance?"),
    ("TST_018", "Which companies visit for campus placement drives?"),
    ("TST_019", "When will exam hall tickets be available for download?"),
    ("TST_020", "What is the contact email for Controller of Examinations?"),
    ("TST_021", "Is biometric attendance mandatory for every period?"),
    ("TST_022", "What is the fee for attendance condonation on medical grounds?"),
    ("TST_023", "What topics are included in Natural Language Processing syllabus?"),
    ("TST_024", "What happens if a student is caught cheating in the exam?"),
    ("TST_025", "What are the mess timings for breakfast and dinner in hostel?"),
    ("TST_026", "Are immersion water heaters allowed inside hostel rooms?"),
    ("TST_027", "How to apply for revaluation of exam answer scripts?"),
    ("TST_028", "What is the minimum pass mark in end semester theory exam?"),
    ("TST_029", "What is the contact number of the campus medical doctor?"),
    ("TST_030", "When is the annual college technical fest TechFest conducted?"),
    ("TST_031", "Can final year students do a 6-month full-time internship?"),
    ("TST_032", "Who is the Head of Department of CSE at MLRIT?"),
    ("TST_033", "What is the syllabus of Full Stack Web Development CS705PC?"),
    ("TST_034", "What is the procedure for parents to grant hostel weekend leave?"),
    ("TST_035", "What is the college anti-ragging policy?"),
    ("TST_036", "What is the minimum CGPA needed for B.Tech with Honours degree?"),
    ("TST_037", "What marks weightage is given for attendance in internal marks?"),
    ("TST_038", "How many books can undergraduate students borrow from library?"),
    ("TST_039", "What is the date for Full Stack Development practical lab exam?"),
    ("TST_040", "Where can I reset my college ERP portal password?"),
    ("TST_041", "What should I do if I missed an exam due to hospitalization?"),
    ("TST_042", "What is the placement training attendance requirement?"),
    ("TST_043", "When will the results of 7th semester exams be announced?"),
    ("TST_044", "Is Wi-Fi available across student hostels?"),
    ("TST_045", "What is the penalty for missing a registered placement interview?"),
    ("TST_046", "How are internal assessment marks calculated from two mid exams?"),
    ("TST_047", "What is the email id of Mrs. Arshiya Begum?"),
    ("TST_048", "When is the Major Project Stage 1 review scheduled?"),
    ("TST_049", "What are the rules regarding campus dress code during interviews?"),
    ("TST_050", "How does CampusIQ retrieve answers from university documents?")
]

test_csv_path = os.path.join(base_dir, "test_queries.csv")
with open(test_csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["query_id", "query"])
    for row in test_queries:
        writer.writerow(row)
print(f"Saved test_queries.csv: {len(test_queries)} queries")
