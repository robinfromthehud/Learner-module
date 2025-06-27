from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId, json_util
import json
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="Learn-the-Learner (Backend) ")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb+srv://dbuser:dbuser2280@test.stzoarv.mongodb.net/"
DB_NAME = "learning-buddy"
COLLECTION_NAME = "LM"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Pydantic Models
class StudentSummary(BaseModel):
    studentId: str
    name: str
    city: str
    institution: str
    progress: float
    lastActivity: str
    coursesEnrolled: int
    overallGPA: float

class StudentResponse(BaseModel):
    studentId: str
    metadata: dict
    personalInformation: dict
    professionalInformation: dict
    Courses: dict
    engagementMetrics: dict
    cognitiveProfile: dict
    feedbackResponse: dict

class AnalyticsResponse(BaseModel):
    engagementTrends: dict
    contentInteraction: dict

def convert_datetime(obj):
    """Convert datetime objects to ISO format strings"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_datetime(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_datetime(item) for item in obj]
    return obj

def parse_mongo_document(doc):
    """Parse MongoDB document to Python dict with proper datetime handling"""
    if not doc:
        return None
    doc = json_util.loads(json_util.dumps(doc))
    return convert_datetime(doc)

@app.get("/api/students/summary", response_model=List[StudentSummary])
async def get_students_summary():
    """Returns a summary list of all students with key information"""
    try:
        projection = {
            "studentId": 1,
            "personalInformation.name": 1,
            "personalInformation.location.city": 1,
            "personalInformation.institution": 1,
            "Courses": 1,
            "engagementMetrics.platformEngagement.lastActivity": 1,
            "_id": 0
        }
        
        students = list(collection.find({}, projection))
        
        result = []
        for student in parse_mongo_document(students):
            courses = student.get("Courses", {})
            course_keys = [k for k in courses.keys() if k != "Course Project Grade"]
            
            progresses = [course["progress"] for course in courses.values() 
                         if isinstance(course, dict) and "progress" in course]
            overall_progress = sum(progresses) / len(progresses) if progresses else 0
            
            # Handle nested lastActivity field
            last_activity = student.get("engagementMetrics", {}).get("platformEngagement", {}).get("lastActivity")
            if isinstance(last_activity, dict) and "$date" in last_activity:
                last_activity = last_activity["$date"]
            
            result.append(StudentSummary(
                studentId=student["studentId"],
                name=student["personalInformation"]["name"],
                city=student["personalInformation"]["location"]["city"],
                institution=student["personalInformation"]["institution"],
                progress=overall_progress,
                lastActivity=last_activity or "",
                coursesEnrolled=len(course_keys),
                overallGPA=4.2
            ))
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/students/{student_id}", response_model=StudentResponse)
async def get_student_details(student_id: str):
    """Returns complete details for a specific student"""
    try:
        student = collection.find_one({"studentId": student_id}, {"_id": 0})
        student_data = parse_mongo_document(student)
        if not student_data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Convert field names to match frontend expectations
        response_data = {
            "studentId": student_data["studentId"],
            "metadata": student_data.get("metadata", {}),
            "personalInformation": student_data.get("personalInformation", {}),
            "professionalInformation": student_data.get("professionalInformation", {}),
            "Courses": student_data.get("Courses", {}),
            "engagementMetrics": student_data.get("engagementMetrics", {}),
            "cognitiveProfile": student_data.get("cognitiveProfile", {}),
            "feedbackResponse": student_data.get("feedbackResponse", {})
        }
        
        return StudentResponse(**response_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/students/{student_id}/analytics", response_model=AnalyticsResponse)
async def get_student_analytics(student_id: str):
    """Returns analytics data for a specific student"""
    try:
        student = collection.find_one({"studentId": student_id}, {"_id": 0})
        student_data = parse_mongo_document(student)
        if not student_data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        engagement = student_data.get("engagementMetrics", {})
        platform = engagement.get("platformEngagement", {})
        content = engagement.get("contentInteraction", {})
        
        analytics = AnalyticsResponse(
            engagementTrends={
                "logins": platform.get("loginFrequency", {}),
                "sessions": platform.get("sessionDuration", {})
            },
            contentInteraction={
                "videos": content.get("videosWatched", {}),
                "documents": content.get("documentsAccessed", 0),
                "forumActivity": content.get("discussionContributions", {})
            }
        )
        
        return analytics
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))