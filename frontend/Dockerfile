FROM node:current as devel-builder

WORKDIR /app
ADD package.json /app
RUN npm install

ADD . /app
CMD npm run dev

FROM devel-builder AS production-build

COPY . /app
RUN npm run build

FROM nginx:stable-alpine
COPY --from=production-build /app/dist /usr/share/nginx/html/
