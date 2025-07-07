from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Dict
import httpx
import logging
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from cachetools import TTLCache

load_dotenv()

app = FastAPI(title="Learn-the-Learner (Backend) - Optimized")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
AUTH_API_URL = "https://dev-lms.sarasai.org/api/login"
STUDENTS_API_URL = "https://dev-lms.sarasai.org/api/students"
TOKEN_EXPIRY_MINUTES = 30
CACHE_TTL_SECONDS = 300  # 5 minutes

# Caches
token_cache = {"token": None, "expiry": None}
student_cache = TTLCache(maxsize=1000, ttl=CACHE_TTL_SECONDS)

class TokenResponse(BaseModel):
    success: bool
    message: str
    data: dict

class StudentSummary(BaseModel):
    studentId: str
    idx: str
    name: str
    city: str
    institution: str
    progress: float
    coursesEnrolled: int
    overallGPA: float
    email: str
    phone: str

class StudentResponse(BaseModel):
    studentId: str
    idx: str
    metadata: dict
    personalInformation: dict
    professionalInformation: dict
    Courses: Union[List[dict], Dict[str, dict]]
    engagementMetrics: dict
    cognitiveProfile: dict
    feedbackResponse: dict

class AnalyticsResponse(BaseModel):
    engagementTrends: dict
    contentInteraction: dict

async def get_auth_token():
    """Get a new bearer token with caching and expiry"""
    if token_cache["token"] and token_cache["expiry"] and token_cache["expiry"] > datetime.utcnow():
        return token_cache["token"]

    auth_payload = {
        "role": "subAdmin",
        "email": "divyansh.s@sarasai.org",
        "password": "12345678"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(AUTH_API_URL, json=auth_payload)
            response.raise_for_status()
            token_data = response.json()

            if not token_data.get("success"):
                raise ValueError("Authentication failed in API response")

            token = token_data["data"]["token"]
            token_cache["token"] = token
            token_cache["expiry"] = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRY_MINUTES)
            logger.info("Successfully obtained new auth token")
            return token

    except httpx.HTTPError as e:
        logger.error(f"HTTP error while getting auth token: {str(e)}")
        raise HTTPException(status_code=502, detail="Authentication service unavailable")
    except Exception as e:
        logger.error(f"Failed to get auth token: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")

async def fetch_with_retry(url: str, headers: dict = None, retry: bool = True):
    """Fetch data with token retry logic and timeout"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)

            if response.status_code == 401 and retry:
                logger.info("Token expired, attempting to refresh...")
                token_cache["token"] = None
                new_token = await get_auth_token()
                new_headers = {"Authorization": f"Bearer {new_token}"}
                return await fetch_with_retry(url, new_headers, retry=False)

            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as e:
        logger.error(f"API request failed: {str(e)}")
        raise HTTPException(status_code=502, detail="Upstream service error")
    except httpx.Timeout:
        logger.error("API request timed out")
        raise HTTPException(status_code=504, detail="Upstream service timeout")
    except Exception as e:
        logger.error(f"Unexpected API error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def fetch_students_data():
    """Fetch students data with caching"""
    cache_key = "all_students"
    if cache_key in student_cache:
        return student_cache[cache_key]

    token = await get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    data = await fetch_with_retry(STUDENTS_API_URL, headers)
    student_cache[cache_key] = data
    return data

async def fetch_specific_student_data(student_id: str):
    """Fetch specific student data with caching"""
    if student_id in student_cache:
        return student_cache[student_id]

    token = await get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://dev-lms.sarasai.org/api/learner-dashboard/info?enrollment_id={student_id}"
    
    data = await fetch_with_retry(url, headers)
    student_cache[student_id] = data
    return data

@app.get("/api/students/summary", response_model=List[StudentSummary])
async def get_students_summary():
    """Optimized summary endpoint with caching"""
    try:
        api_response = await fetch_students_data()

        if not api_response.get("success"):
            raise HTTPException(status_code=404, detail="No students found")

        return [
            StudentSummary(
                studentId=student["user_id"],
                idx=str(student["id"]),
                name=student["name"],
                city=student.get("city", "Unknown"),
                institution="Saras AI",
                progress=0.75,
                coursesEnrolled=len([pkg for pkg in student.get("packages", []) if pkg.get("product")]),
                overallGPA=4.2,
                email=student['email'],
                phone=student['phone'],
            )
            for student in api_response["data"]
        ]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_students_summary: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/students/{student_id}", response_model=StudentResponse)
async def get_student_details(student_id: str):
    """Optimized student details endpoint with caching"""
    try:
        api_response = await fetch_specific_student_data(student_id)

        if not api_response.get("success"):
            raise HTTPException(status_code=404, detail="Student not found")

        student_data = api_response["data"]

        if student_data.get("user_id") != student_id:
            raise HTTPException(status_code=404, detail="Student ID mismatch")

        return StudentResponse(
            studentId=student_data["user_id"],
            idx=str(student_data["id"]),
            metadata={
                "createdAt": student_data.get("created_at"),
                "updatedAt": student_data.get("updated_at"),
                "isActive": bool(student_data.get("is_active", 1))
            },
            personalInformation={
                "name": student_data["name"],
                "dob": student_data["dob"],
                "gender": student_data["gender"],
                "email": student_data["email"],
                "country": student_data["country"],
                "state": student_data["state"],
                "city": student_data["city"],
                "address": student_data["address"],
                "pincode": student_data["pincode"],
                "country_code": student_data["country_code"],
                "phone": student_data["phone"],
                "user_id": student_data["user_id"],
            },
            professionalInformation={},
            Courses=student_data.get("courses", []),
            engagementMetrics={
                "platformEngagement": {
                    "lastActivity": student_data.get("created_at")
                },
                "contentInteraction": {}
            },
            cognitiveProfile={},
            feedbackResponse={}
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_student_details: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/students/{student_id}/analytics", response_model=AnalyticsResponse)
async def get_student_analytics(student_id: str):
    """Optimized analytics endpoint with static data"""
    try:
        return AnalyticsResponse(
            engagementTrends={
                "logins": {"count": 10, "lastLogin": "2025-06-01"},
                "sessions": {"averageDuration": 30, "totalMinutes": 300}
            },
            contentInteraction={
                "videos": {"count": 15, "lastWatched": "2025-05-30"},
                "documents": 5,
                "forumActivity": {"posts": 3, "replies": 2}
            }
        )
    except Exception as e:
        logger.error(f"Error in get_student_analytics: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
    

@app.get("/api/students/{student_id}/courses/{course_id}")
async def get_student_course_details(student_id: str, course_id: int):
    """Returns detailed course information for a specific student"""
    try:
        token = await get_auth_token()
        headers = {"Authorization": f"Bearer {token}"}
        url = f"https://dev-lms.sarasai.org/api/activity-report/student-course-detail?course_id={course_id}&student_id={student_id}"
        
        response = await fetch_with_retry(url, headers)
        
        if not response.get("success"):
            raise HTTPException(status_code=404, detail="Course data not found")
            
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_student_course_details: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")