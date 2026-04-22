FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml ctype

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction
RUN mkdir -p storage/framework/{sessions,views,cache,testing} storage/logs bootstrap/cache
RUN chmod -R a+rw storage bootstrap/cache
RUN php artisan config:cache
RUN php artisan route:cache

CMD ["/bin/sh", "-c", "php -S 0.0.0.0:$PORT -t public/"]
