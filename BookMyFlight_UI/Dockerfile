# Étape 1 : Build avec Node.js
FROM node:14-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .
ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=false
RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]