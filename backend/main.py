from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Including all the routers
from routers.nlp_router import router as nlp_router
from routers.auth_router import router as auth_router
from routers.crud_router import router as crud_router

# Connection function from utilities
from utils.database import connect_to_database

# Generated FastAPI application instance
app = FastAPI()

# Allowed CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_credentials=True,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"],
)

try:
	# Connect to the database using the URI in the env file
	database = connect_to_database()
	if database is None:
		raise Exception
# Caught error in case the database is not connected
except Exception as err:
	print("No mongo instance found.")
	exit(1)

app.include_router(nlp_router, tags=["Natural Language Processor"])
app.include_router(auth_router, tags=["Authentication"])
app.include_router(crud_router, tags=["CRUD on list"])
