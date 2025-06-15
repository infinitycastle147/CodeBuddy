# CodeBuddy Backend

CodeBuddy is a FastAPI-based backend application designed to assist developers with code-related tasks, including repository processing, diagram generation, and vector-based code search.

---

## **Features**

- Repository setup and processing
- Diagram generation using Mermaid syntax
- Vector-based code search
- Integration with GitHub and Jira
- Celery-based task queue for background processing

---

## **Project Structure**

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── settings.py
│   ├── api/
│   │   ├── dependencies.py
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   ├── routers/
│   │   ├── tools_router.py
│   │   ├── chat_router.py
│   │   ├── connection_router.py
│   │   ├── diagram_router.py
│   ├── utils/
│   │   ├── xml_converter.py
│   │   ├── github_handler.py
│   │   ├── embedder.py
│   ├── agents/
│   │   ├── agent.py
│   │   ├── prompts/
│   │   ├── constants/
│   ├── celery/
│   │   ├── worker.py
│   ├── tests/
│       ├── test_tools_router.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
├── Dockerfile
├── docker-compose.yml
```

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-repo/codebuddy-backend.git
cd codebuddy-backend
```

### **2. Create a Virtual Environment**

```bash
python -m venv venv
```

### **3. Activate the Virtual Environment**

- **Linux/macOS**:
  ```bash
  source venv/bin/activate
  ```
- **Windows**:
  ```bash
  venv\Scripts\activate
  ```

### **4. Install Dependencies**

```bash
pip install -r requirements.txt
```

---

## **Environment Variables**

Create a `.env` file in the root directory and configure the following variables:

```env
APPLICATION_NAME=CodeBuddy
APPLICATION_HOST=0.0.0.0
APPLICATION_PORT=8000
APPLICATION_UVICORN_TIMEOUT=120
APPLICATION_UVICORN_GRACEFUL_TIMEOUT=30
APPLICATION_UVICORN_KEEP_ALIVE=2
APPLICATION_AUTO_RELOAD=False
APPLICATION_ENVIRONMENT=dev
APPLICATION_CORS_ALLOW_ORIGINS=*
APPLICATION_CORS_ALLOW_METHODS=GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS
APPLICATION_CORS_ALLOW_HEADERS=*
APPLICATION_UVICORN_WORKERS_COUNT=4
APPLICATION_REDIS_URL=redis://localhost:6379/0
APPLICATION_MONGO_URI=mongodb://localhost:27017/
APPLICATION_MONGO_DB=CodeBuddy
APPLICATION_MONGO_COLLECTION=codebuddy
APPLICATION_ENCRYPTION_KEY=your_encryption_key_here
```

---

## **Running the Application**

### **1. Start Redis**

```bash
docker run -p 6379:6379 redis
```

### **2. Run the FastAPI Application**

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### **3. Start Celery Worker**

```bash
celery -A app.celery.worker.celery_app worker --loglevel=info
```

---

## **Docker Deployment**

### **1. Build and Run with Docker Compose**

```bash
docker-compose up --build
```

### **2. Access the Application**

- FastAPI: [http://localhost:8000](http://localhost:8000)
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## **Testing**

### **Run Unit Tests**

```bash
pytest app/tests
```

---

## **Logging**

Logs are stored in the `logs/` directory. You can configure logging in `app/core/logging.py`.

---

## **Production Deployment**

### **1. Build Docker Image**

```bash
docker build -t codebuddy-backend .
```

### **2. Run the Container**

```bash
docker run -p 8000:8000 codebuddy-backend
```

### **3. Use Nginx as a Reverse Proxy**

Configure Nginx to route traffic to the FastAPI application.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

---

## **License**

This project is licensed under the MIT License.

---

## **Contact**

For questions or support, contact [your-email@example.com](mailto:your-email@example.com).
