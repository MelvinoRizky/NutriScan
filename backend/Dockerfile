# ============================================
# NutriScan - Backend Dockerfile (Node.js)
# ============================================

FROM node:20-slim

# Install Python3 + pip untuk script AI/ML di backend
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files dulu (layer caching lebih efisien)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --omit=dev

# Install Python dependencies jika ada requirements.txt
COPY requirements.txt* ./
RUN if [ -f requirements.txt ]; then \
      python3 -m venv /app/venv && \
      /app/venv/bin/pip install --no-cache-dir -r requirements.txt; \
    fi

# Copy seluruh source code backend
COPY . .

# Set PYTHON_EXECUTABLE ke venv agar module ketemu
ENV PYTHON_EXECUTABLE=/app/venv/bin/python3


# Expose port backend
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

# Jalankan server
CMD ["npm", "start"]
