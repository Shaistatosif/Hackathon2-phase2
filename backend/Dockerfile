FROM python:3.12-slim

WORKDIR /app

# Environment variables (secrets set via deployment platform)
ENV JWT_ALGORITHM=HS256
ENV OPENAI_MODEL=gpt-4o-mini
ENV CORS_ORIGINS_STR=https://hackathon2-phase2.vercel.app
ENV ENVIRONMENT=production

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 7860

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
