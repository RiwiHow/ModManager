import uvicorn
from fastapi import FastAPI

# from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# # Enable CORS for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React dev server
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


@app.get("/api/test")
async def test_connection():
    return {"message": "Backend connected successfully!"}


if __name__ == "__main__":
    uvicorn.run(app)
