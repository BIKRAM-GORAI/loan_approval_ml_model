import sys
import os

# Add root directory to sys.path so modules can be imported
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.app import app

# Vercel looks for the WSGI/ASGI 'app' object
# 'app' is already initialized in app.app
