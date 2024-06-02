COPY . .

RUN npm install
RUN npm run build
RUN node .build/src/server.js