# создаем образ на основе Node.js
FROM node:18

# устанавливаем рабочую директорию
WORKDIR /app

# копируем package.json и package-lock.json
COPY package*.json ./

# устанавливаем зависимости
RUN npm install

# копируем остальные файлы проекта
COPY . .

# открываем порт 3000
EXPOSE 3000

RUN npx prisma generate

# запускаем сервер Express.js
CMD ["npm", "run", "start"]