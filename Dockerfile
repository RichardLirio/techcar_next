FROM node:22.17.0-alpine AS base

WORKDIR /app

# Aceitar argumentos de build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Remover devDependencies após o build para reduzir tamanho
RUN npm prune --production

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]