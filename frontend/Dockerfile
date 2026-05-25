# ============================================
# NutriScan - Frontend Dockerfile (Expo)
# ============================================
# Catatan: Expo dirancang untuk mobile (iOS/Android).
# Untuk kontainerisasi, kita jalankan dalam mode WEB (expo web)
# yang menghasilkan React app yang bisa diakses via browser.
# Untuk build APK/IPA, gunakan EAS Build (eas.json) — tidak perlu Docker.
# ============================================

# --- Stage 1: Builder ---
FROM node:20-slim AS builder

WORKDIR /app

# Accept build arguments
ARG EXPO_PUBLIC_SUPABASE_URL
ARG EXPO_PUBLIC_SUPABASE_ANON_KEY
ARG EXPO_PUBLIC_API_URL

# Set as environment variables for build
ENV EXPO_PUBLIC_SUPABASE_URL=$EXPO_PUBLIC_SUPABASE_URL
ENV EXPO_PUBLIC_SUPABASE_ANON_KEY=$EXPO_PUBLIC_SUPABASE_ANON_KEY
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Copy package files
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies untuk build)
RUN npm ci

# Copy source code
COPY . .

# Build web version dari Expo
RUN npx expo export --platform web

# --- Stage 2: Production (serve static files) ---
FROM nginx:alpine

# Copy hasil build ke nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy konfigurasi nginx custom (untuk SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
