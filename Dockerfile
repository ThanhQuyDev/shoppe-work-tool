# Chọn Node.js LTS alpine image
FROM node:20-alpine

# Tạo thư mục app
RUN mkdir -p /usr/src/node-app \
    && chown -R node:node /usr/src/node-app

# Thiết lập working directory
WORKDIR /usr/src/node-app

# Copy package.json và yarn.lock trước để cache dependencies
COPY package.json yarn.lock ./

# Sử dụng user node (an toàn hơn root)
USER node

# Cài dependencies
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code, giữ quyền của node
COPY --chown=node:node . .

# Nếu app cần build (TypeScript / frontend), uncomment:
# RUN yarn build

# Mở port cho Railway
EXPOSE 3000

# Command mặc định để chạy app
CMD ["yarn", "start"]
