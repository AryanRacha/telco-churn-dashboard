import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

# Define the path to your visuals directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VISUALS_DIR = os.path.join(BASE_DIR, '..', 'reports/visuals')

router = APIRouter()

@router.get("/{image_name}")
async def get_image(image_name: str):
    """
    Serves a static image file from the reports/visuals directory.
    This endpoint *will* get the correct CORS headers from main.py.
    """
    
    # Basic security check to prevent users from accessing other files
    if ".." in image_name or "/" in image_name:
        raise HTTPException(status_code=400, detail="Invalid image name")

    file_path = os.path.join(VISUALS_DIR, image_name)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Image '{image_name}' not found")
    
    # Return the image as a file response
    return FileResponse(file_path)