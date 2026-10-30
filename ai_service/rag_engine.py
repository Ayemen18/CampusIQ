import os
import json
import re
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pypdf
import requests

class RAGDocument:
    def __init__(self, doc_id: str, title: str, category: str, content: str, source: str, page: int = 1, metadata: dict = None):
        self.doc_id = doc_id
        self.title = title
        self.category = category
        self.content = content
        self.source = source
        self.page = page
        self.metadata = metadata or {}

class CampusIQRAGEngine:
    def __init__(self, dataset_dir: str = None):
        self.documents: List[RAGDocument] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self.dataset_dir = dataset_dir or os.path.join(os.path.dirname(__file__), "dataset")
        self.load_initial_knowledge_base()
        self.rebuild_vector_index()

    def load_initial_knowledge_base(self):
        """Loads the 190 records from the 10 JSON files"""
        self.documents = []
        if not os.path.exists(self.dataset_dir):
            return

        json_files = {
            "faculty_information.json": "Faculty Directory",
            "course_information.json": "Course Catalog",
            "examination_schedules.json": "Examination Schedule",
            "academic_calendar.json": "Academic Calendar",
            "attendance_policies.json": "Attendance Policy",
            "placement_policies.json": "Placement Guidelines",
            "campus_services.json": "Campus Services",
            "holidays.json": "University Holidays",
            "hostel_information.json": "Hostel Regulations",
            "faqs.json": "Institutional FAQs"
        }

        for filename, category in json_files.items():
            path = os.path.join(self.dataset_dir, filename)
            if not os.path.exists(path):
                continue

            try:
                with open(path, "r", encoding="utf-8") as f:
                    records = json.load(f)

                for r in records:
                    doc_id = r.get("doc_id", f"DOC_{len(self.documents)+1}")
                    
                    if "faculty_information" in filename:
                        title = f"{r.get('name')} - {r.get('designation')} ({r.get('department')})"
                        content = f"Faculty Name: {r.get('name')}. Designation: {r.get('designation')}. Department: {r.get('department')}. Subjects handled: {', '.join(r.get('subjects', []))}. Contact email: {r.get('email')}."
                    elif "course_information" in filename:
                        title = f"{r.get('course')} (Sem {r.get('semester')})"
                        content = f"Course: {r.get('course')}. Semester: {r.get('semester')}. Credits: {r.get('credits')}. Department: {r.get('department')}. Faculty Instructor: {r.get('faculty')}. Syllabus & Topics: {r.get('syllabus')}."
                    elif "examination_schedules" in filename:
                        title = f"Exam: {r.get('subject')} - {r.get('date')}"
                        content = f"Examination Subject: {r.get('subject')}. Semester: {r.get('semester')}. Date: {r.get('date')}. Time: {r.get('time')}. Venue: {r.get('venue')}. Type: {r.get('type')}."
                    elif "academic_calendar" in filename:
                        title = f"Calendar: {r.get('event')}"
                        content = f"Academic Calendar Event: {r.get('event')}. Date / Duration: {r.get('date')}. Details: {r.get('description')}."
                    elif "attendance_policies" in filename:
                        title = r.get("title", "Attendance Policy")
                        content = f"Policy Title: {r.get('title')}. Policy Details: {r.get('policy')}. Condonation Rules: {r.get('condonation_rule')}. Minimum Required Attendance: {r.get('minimum_percentage')}%."
                    elif "placement_policies" in filename:
                        title = f"Placement Rule: {r.get('company_type')}"
                        content = f"Recruitment Category: {r.get('company_type')}. Criteria: {r.get('rule')}. Minimum CGPA: {r.get('eligibility_cgpa')}. Allowed Backlogs: {r.get('allowed_backlogs')}. Guidelines: {r.get('guidelines')}."
                    elif "campus_services" in filename:
                        title = f"Service: {r.get('service')}"
                        content = f"Campus Service: {r.get('service')}. Timings: {r.get('timing')}. Location: {r.get('location')}. Contact: {r.get('contact')}. Details: {r.get('details')}."
                    elif "holidays" in filename:
                        title = f"Holiday: {r.get('holiday')}"
                        content = f"University Holiday: {r.get('holiday')}. Date: {r.get('date')}. Type: {r.get('type')}. Remarks: {r.get('remarks')}."
                    elif "hostel_information" in filename:
                        title = f"Hostel Rule: {r.get('rule')}"
                        content = f"Hostel Regulation: {r.get('rule')}. Timings: {r.get('timings')}. Mess Schedule: {r.get('mess_schedule')}. Warden Contact: {r.get('warden_contact')}. Disciplinary Rules: {r.get('discipline')}."
                    elif "faqs" in filename:
                        title = f"FAQ: {r.get('question')}"
                        content = f"Question: {r.get('question')}. Answer: {r.get('answer')}. Category: {r.get('category')}."
                    else:
                        title = doc_id
                        content = json.dumps(r)

                    self.documents.append(RAGDocument(
                        doc_id=doc_id,
                        title=title,
                        category=category,
                        content=content,
                        source=filename,
                        page=1,
                        metadata=r
                    ))
            except Exception as e:
                print(f"Error loading {filename}: {e}")

    def rebuild_vector_index(self):
        """Builds TF-IDF vector index and semantic similarity matrix"""
        if not self.documents:
            self.vectorizer = None
            self.tfidf_matrix = None
            return

        corpus = [f"{doc.title} {doc.category} {doc.content}" for doc in self.documents]
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            max_df=0.85,
            min_df=1,
            sublinear_tf=True
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def ingest_pdf(self, file_path: str, source_name: str, category: str = "Uploaded Document") -> int:
        """Extracts text from uploaded PDF, performs chunking and indexes it"""
        try:
            reader = pypdf.PdfReader(file_path)
            added_count = 0
            
            for page_num, page in enumerate(reader.pages):
                raw_text = page.extract_text() or ""
                # Clean text
                clean_text = re.sub(r'\s+', ' ', raw_text).strip()
                if len(clean_text) < 30:
                    continue

                # Paragraph or sliding window chunking (approx 500 characters with 100 char overlap)
                chunk_size = 500
                overlap = 100
                chunks = []
                start = 0
                while start < len(clean_text):
                    end = min(start + chunk_size, len(clean_text))
                    chunks.append(clean_text[start:end])
                    if end == len(clean_text):
                        break
                    start += (chunk_size - overlap)

                for idx, chunk in enumerate(chunks):
                    doc_id = f"PDF_{len(self.documents)+1}_{page_num+1}_{idx+1}"
                    title = f"{source_name} - Page {page_num + 1} (Sec {idx + 1})"
                    self.documents.append(RAGDocument(
                        doc_id=doc_id,
                        title=title,
                        category=category,
                        content=chunk,
                        source=source_name,
                        page=page_num + 1,
                        metadata={"source_file": source_name, "chunk_index": idx}
                    ))
                    added_count += 1

            self.rebuild_vector_index()
            return added_count
        except Exception as e:
            print(f"Failed to ingest PDF {file_path}: {e}")
            raise e

    def retrieve(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """Retrieves top-k relevant document chunks with relevance scores"""
        if not self.vectorizer or self.tfidf_matrix is None or not self.documents:
            return []

        clean_query = query.strip()
        query_vec = self.vectorizer.transform([clean_query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        # Keyword booster for exact matches on codes, names, or percentages
        keywords = re.findall(r'\b[a-zA-Z0-9_\-\.]{2,}\b', clean_query.lower())
        boosted_scores = np.copy(similarities)
        for i, doc in enumerate(self.documents):
            doc_lower = (doc.title + " " + doc.content).lower()
            match_count = sum(1 for kw in keywords if kw in doc_lower)
            if match_count > 0:
                boosted_scores[i] += (match_count * 0.05)

        ranked_indices = np.argsort(boosted_scores)[::-1]
        results = []
        for idx in ranked_indices[:top_k]:
            score = float(boosted_scores[idx])
            doc = self.documents[idx]
            results.append({
                "doc_id": doc.doc_id,
                "title": doc.title,
                "category": doc.category,
                "content": doc.content,
                "source": doc.source,
                "page": doc.page,
                "score": round(score, 4),
                "metadata": doc.metadata
            })
        return results

    def generate_answer(self, query: str) -> Dict[str, Any]:
        """Performs full RAG: retrieval, context assembly, and answer generation with citations"""
        retrieved_docs = self.retrieve(query, top_k=4)

        # Check for insufficient context / irrelevant queries
        max_score = retrieved_docs[0]["score"] if retrieved_docs else 0.0
        if not retrieved_docs or max_score < 0.07:
            return {
                "answer": "I do not have sufficient institutional records in the CampusIQ Knowledge Base to answer this question accurately. Please refer to the official University Academic Regulations or visit the Academic Affairs Office.",
                "sources": [],
                "confidence": "Low",
                "suggested_questions": [
                    "What is the minimum attendance required for semester examinations?",
                    "What are the placement eligibility criteria for Tier-1 companies?",
                    "When are the 7th semester end examinations scheduled?",
                    "What is the attendance condonation policy?"
                ]
            }

        context_text = "\n\n".join([
            f"[Source: {d['source']} | Page {d['page']} | ID: {d['doc_id']}]:\n{d['content']}"
            for d in retrieved_docs
        ])

        # Check if an LLM API key is present
        openai_key = os.getenv("OPENAI_API_KEY")
        gemini_key = os.getenv("GEMINI_API_KEY")
        groq_key = os.getenv("GROQ_API_KEY")

        answer_text = None
        if groq_key:
            answer_text = self._call_groq_llm(query, context_text, groq_key)
        elif openai_key:
            answer_text = self._call_openai_llm(query, context_text, openai_key)
        elif gemini_key:
            answer_text = self._call_gemini_llm(query, context_text, gemini_key)

        # If LLM not configured or failed, use deterministic synthesized RAG fallback
        if not answer_text:
            answer_text = self._synthesize_rag_fallback(query, retrieved_docs)

        # Extract suggested questions based on matched category
        primary_cat = retrieved_docs[0]["category"]
        suggested = self._get_suggested_questions(primary_cat)

        sources = [{
            "doc_id": d["doc_id"],
            "title": d["title"],
            "source": d["source"],
            "page": d["page"],
            "relevance_score": d["score"],
            "snippet": d["content"][:220] + "..." if len(d["content"]) > 220 else d["content"]
        } for d in retrieved_docs]

        return {
            "query": query,
            "answer": answer_text,
            "sources": sources,
            "confidence": "High" if max_score > 0.3 else "Medium",
            "category": primary_cat,
            "suggested_questions": suggested
        }

    def _synthesize_rag_fallback(self, query: str, retrieved_docs: List[Dict[str, Any]]) -> str:
        """Intelligent extractive and structured synthesis fallback that directly answers based on official sources"""
        top_doc = retrieved_docs[0]
        category = top_doc["category"]
        content = top_doc["content"]

        # Parse key facts from top documents
        paragraphs = []
        
        # Primary verified institutional fact
        paragraphs.append(f"Based on official institutional records from **{top_doc['source']}**:")
        
        # Format the top finding clearly
        clean_content = content
        for prefix in ["Question: ", "Policy Details: ", "Criteria: ", "Details: "]:
            if prefix in clean_content:
                parts = clean_content.split(prefix)
                clean_content = parts[-1]

        paragraphs.append(f"> {top_doc['content']}")

        # If secondary context adds value, append corroborating information
        if len(retrieved_docs) > 1 and retrieved_docs[1]["score"] > 0.15:
            second_doc = retrieved_docs[1]
            if second_doc["doc_id"] != top_doc["doc_id"]:
                paragraphs.append(f"\n**Additional Institutional Reference ({second_doc['title']}):**")
                paragraphs.append(f"{second_doc['content']}")

        paragraphs.append(f"\n*Source Reference: Verified under Document ID `{top_doc['doc_id']}` ({top_doc['source']}, Page {top_doc['page']}).*")
        return "\n\n".join(paragraphs)

    def _get_suggested_questions(self, category: str) -> List[str]:
        suggestions = {
            "Attendance Policy": [
                "What is the condonation fee for attendance between 65% and 75%?",
                "What happens if my aggregate attendance is below 65%?",
                "How do I apply for On-Duty (OD) attendance?"
            ],
            "Placement Guidelines": [
                "What is the One Student One Job placement policy?",
                "Can students with 1 active backlog attend mass recruitment drives?",
                "What companies visit MLRIT campus for hiring?"
            ],
            "Examination Schedule": [
                "When is the Machine Learning semester end examination?",
                "When will hall tickets be released on the student portal?",
                "What is the procedure to apply for revaluation of marks?"
            ],
            "Faculty Directory": [
                "What is the email address of Mrs. Arshiya Begum?",
                "Who is the Head of Department for CSE?",
                "Who teaches Cloud Computing CS703PC?"
            ],
            "Hostel Regulations": [
                "What are the curfew hours for college hostels?",
                "What are the mess timings for breakfast and dinner?",
                "What is the anti-ragging helpline number?"
            ],
            "Campus Services": [
                "What are the operating hours of the Central Library?",
                "Is there an on-campus health clinic and doctor?",
                "What bus routes operate for college transportation?"
            ]
        }
        return suggestions.get(category, [
            "What is the minimum attendance required for semester examinations?",
            "What are the placement eligibility criteria?",
            "When are the upcoming semester examinations?"
        ])

    def _call_openai_llm(self, query: str, context: str, api_key: str) -> Optional[str]:
        try:
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are CampusIQ, the official AI Academic Intelligence assistant for MLRIT. Answer strictly using the verified institutional context provided. Always cite document names and IDs. If the context does not contain the answer, state that information is not available in official records."},
                    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
                ],
                "temperature": 0.2
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=8)
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"OpenAI call failed: {e}")
        return None

    def _call_groq_llm(self, query: str, context: str, api_key: str) -> Optional[str]:
        try:
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": "You are CampusIQ, the official AI Academic Intelligence assistant for MLRIT. Answer strictly using the verified institutional context provided. Always cite document names and IDs."},
                    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
                ],
                "temperature": 0.2
            }
            res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=8)
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Groq call failed: {e}")
        return None

    def _call_gemini_llm(self, query: str, context: str, api_key: str) -> Optional[str]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{
                    "parts": [{"text": f"You are CampusIQ AI. Answer strictly using this institutional context:\n{context}\n\nQuestion: {query}"}]
                }]
            }
            res = requests.post(url, json=payload, timeout=8)
            if res.status_code == 200:
                return res.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"Gemini call failed: {e}")
        return None
