FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g typescript
RUN npm ci
COPY . .
RUN tsc
ENV PORT=3000
EXPOSE $PORT
CMD ["npm", "start"]
