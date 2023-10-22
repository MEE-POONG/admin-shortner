FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /home/app
COPY package.json ./
COPY package-lock.json ./
RUN npm i

FROM node:18-alpine AS builder
WORKDIR /home/app
COPY --from=dependencies /home/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV="production"
RUN npm run build

FROM node:18-slim AS runner
WORKDIR /home/app
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /home/app/.next/standalone ./standalone
COPY --from=builder /home/app/public /home/app/standalone/public
COPY --from=builder /home/app/.next/static /home/app/standalone/.next/static
EXPOSE 3000
ENV PORT 3000
CMD [“node”, “./standalone/server.js”]