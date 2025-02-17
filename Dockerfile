# Sử dụng Node.js phiên bản mới nhất làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ source code vào container
COPY . .

# Biên dịch code TypeScript sang JavaScript
RUN npm run build

# Expose cổng mặc định của ứng dụng
EXPOSE 3000

# Chạy ứng dụng NestJS
CMD ["npm", "run", "start:prod"]
