FROM php:8.2-fpm

# -----------------------------
# System dependencies
# -----------------------------
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libssl-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# PHP extensions
# -----------------------------
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    bcmath \
    gd \
    intl \
    zip \
    opcache

# ✅ Install Redis PHP extension (FIX)
RUN pecl install redis \
    && docker-php-ext-enable redis

# -----------------------------
# Composer
# -----------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -----------------------------
# App
# -----------------------------
WORKDIR /var/www

COPY . .

# -----------------------------
# Install PHP dependencies
# -----------------------------
RUN composer install

# -----------------------------
# Install & build React (Vite)
# -----------------------------
RUN npm install \
    && npm run build \
    && rm -rf node_modules

# -----------------------------
# Nginx config
# -----------------------------
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

# -----------------------------
# Permissions
# -----------------------------
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

# -----------------------------
# Expose port
# -----------------------------
EXPOSE 80

# -----------------------------
# Start services
# -----------------------------
CMD service nginx start && php-fpm
