FROM node:18

WORKDIR /nest-js-crud-vip

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build  # Đảm bảo build project

CMD ["node", "dist/main"]
