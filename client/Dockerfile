# Use a small, efficient base image for your web server
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Copy the client-side files to the nginx web server directory
COPY . /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Command to start the web server
CMD ["nginx", "-g", "daemon off;"]
