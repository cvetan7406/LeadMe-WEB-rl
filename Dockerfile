FROM node:18-alpine as build

# Set up initial working directory
WORKDIR /app

# Install tzdata for timezone configuration
RUN apk add --no-cache tzdata

# Set the timezone
ENV TZ=Europe/Sofia

# Copy Ecopharm folder contents
COPY . .

# Install all dependencies, including devDependencies
RUN npm ci

# Build the application
RUN npm run build

# Set NODE_ENV to production for the runtime environment
ENV NODE_ENV=production

# Production stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
