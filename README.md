Markdown

# Psy Website — сайт психолога (Next.js + Supabase + Vercel)

Проект: сайт для психолога/психотерапевта с блогом, личным кабинетом (админ-панелью), отзывами и комментариями.  
Хостинг: Vercel (Free).  
База данных и авторизация: Supabase (Free).  
Уведомления о заявках: Telegram Bot (бесплатно).

> Важно: в текущей реализации авторизация работает **клиентски (через localStorage Supabase)**. Поэтому все защищённые разделы `/dashboard/*` сделаны **Client Components** и используют RLS Supabase для контроля доступа.

---

## Содержание

- [Функциональность](#функциональность)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Быстрый старт (локально)](#быстрый-старт-локально)
- [Настройка Supabase](#настройка-supabase)
- [SQL: таблицы, RLS-политики, триггер профиля](#sql-таблицы-rls-политики-триггер-профиля)
- [Настройка Telegram](#настройка-telegram)
- [Переменные окружения](#переменные-окружения)
- [Деплой на Vercel](#деплой-на-vercel)
- [Админ-доступ](#админ-доступ)
- [Контент: фото психолога](#контент-фото-психолога)
- [Типовые проблемы и решения](#типовые-проблемы-и-решения)
- [Лицензия](#лицензия)

---

## Функциональность

### Публичная часть сайта
- Главная страница
- Обо мне
- Услуги (с отдельными страницами)
- Блог:
  - список статей
  - страница статьи
  - комментарии (только авторизованные пользователи)
- Отзывы:
  - отображение одобренных отзывов
  - форма добавления отзыва (только авторизованные пользователи, публикация после модерации)
- Контакты + форма обратной связи
- Запись на консультацию (форма)
- Политика конфиденциальности

### Личный кабинет `/dashboard`
- Доступен только авторизованным
- Настройки профиля (смена имени)
- **Админ-панель** (роль `admin` в таблице `profiles`):
  - управление статьями (создание/редактирование/удаление)
  - модерация отзывов (одобрить/скрыть/удалить)
  - просмотр/удаление комментариев

---

## Технологии

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Supabase**
  - Auth (email/password)
  - Postgres + RLS
- Telegram Bot API (уведомления о заявках/сообщениях)

---

## Структура проекта

Ключевые файлы:

- `src/lib/supabase.ts` — singleton Supabase client для браузера
- `src/lib/auth-context.tsx` — контекст авторизации + загрузка профиля из `profiles`
- `src/app/dashboard/*` — личный кабинет (client-guard)
- `src/app/api/booking/route.ts` — заявка на консультацию (Supabase insert + Telegram)
- `src/app/api/contact/route.ts` — сообщение из формы (Supabase insert + Telegram)
- `src/components/home/*` — секции главной
- `src/components/dashboard/*` — админ-компоненты (редактор статей, модерация, списки)

---

## Быстрый старт (локально)

```bash
npm install
npm run dev
# http://localhost:3000
Сборка:

Bash

npm run build
npm start
Настройка Supabase
Создайте проект в Supabase: https://supabase.com

Включите Email Auth:

Supabase → Authentication → Providers → Email → Enable
Для простоты можно отключить Confirm email (иначе нужен email confirm flow)
В Supabase → SQL Editor выполните SQL (см. раздел ниже) для:

таблиц
RLS-политик
триггера, создающего profiles при регистрации
В Supabase → Settings → API:

Project URL → NEXT_PUBLIC_SUPABASE_URL
anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
SQL: таблицы, RLS-политики, триггер профиля
Выполните в Supabase → SQL Editor (целым куском):

SQL

-- ========= CLEANUP (optional) =========
-- ВНИМАНИЕ: удаляет таблицы/функции проекта, если они уже есть
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS posts CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS contact_messages CASCADE;
-- DROP TABLE IF EXISTS subscribers CASCADE;
-- DROP TABLE IF EXISTS page_views CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ========= profiles =========
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  email VARCHAR(255) DEFAULT '',
  full_name VARCHAR(100) DEFAULT '',
  avatar_url TEXT DEFAULT NULL,
  role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin'))
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_all ON profiles;
CREATE POLICY profiles_select_all
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========= trigger: create profile on signup =========
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ========= updated_at helper =========
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ========= posts =========
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  read_time VARCHAR(20) DEFAULT '5 мин',
  image_url TEXT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  views_count INT DEFAULT 0
);

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS posts_select_published_or_admin ON posts;
CREATE POLICY posts_select_published_or_admin
  ON posts FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS posts_insert_admin ON posts;
CREATE POLICY posts_insert_admin
  ON posts FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS posts_update_admin ON posts;
CREATE POLICY posts_update_admin
  ON posts FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS posts_delete_admin ON posts;
CREATE POLICY posts_delete_admin
  ON posts FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ========= comments =========
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comments_select_approved_or_own_or_admin ON comments;
CREATE POLICY comments_select_approved_or_own_or_admin
  ON comments FOR SELECT
  USING (
    is_approved = true
    OR auth.uid() = author_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS comments_insert_auth ON comments;
CREATE POLICY comments_insert_auth
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS comments_delete_own_or_admin ON comments;
CREATE POLICY comments_delete_own_or_admin
  ON comments FOR DELETE
  USING (
    auth.uid() = author_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS comments_update_admin ON comments;
CREATE POLICY comments_update_admin
  ON comments FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ========= reviews =========
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  rating INT DEFAULT 5 NOT NULL CHECK (rating >= 1 AND rating <= 5),
  service VARCHAR(100) DEFAULT '',
  is_approved BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reviews_select_approved_or_own_or_admin ON reviews;
CREATE POLICY reviews_select_approved_or_own_or_admin
  ON reviews FOR SELECT
  USING (
    (is_approved = true AND is_visible = true)
    OR auth.uid() = author_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS reviews_insert_auth ON reviews;
CREATE POLICY reviews_insert_auth
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS reviews_delete_own_or_admin ON reviews;
CREATE POLICY reviews_delete_own_or_admin
  ON reviews FOR DELETE
  USING (
    auth.uid() = author_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS reviews_update_admin ON reviews;
CREATE POLICY reviews_update_admin
  ON reviews FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ========= bookings =========
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) DEFAULT '',
  service VARCHAR(100) NOT NULL,
  format VARCHAR(50) NOT NULL DEFAULT 'Онлайн (видео)',
  preferred_time VARCHAR(100) DEFAULT '',
  message TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'new' NOT NULL CHECK (status IN ('new','contacted','confirmed','completed','cancelled')),
  source VARCHAR(50) DEFAULT 'website',
  utm_source VARCHAR(100) DEFAULT '',
  utm_medium VARCHAR(100) DEFAULT '',
  utm_campaign VARCHAR(100) DEFAULT ''
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bookings_insert_anon ON bookings;
CREATE POLICY bookings_insert_anon
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS bookings_select_admin ON bookings;
CREATE POLICY bookings_select_admin
  ON bookings FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role='admin'));

-- ========= contact_messages =========
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) DEFAULT '',
  subject VARCHAR(200) DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contacts_insert_anon ON contact_messages;
CREATE POLICY contacts_insert_anon
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS contacts_select_admin ON contact_messages;
CREATE POLICY contacts_select_admin
  ON contact_messages FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role='admin'));
Настройка Telegram
Создайте бота в Telegram через @BotFather, получите токен.
Получите chat_id:
Напишите боту /start
Откройте https://api.telegram.org/bot<TOKEN>/getUpdates
Найдите chat.id
Переменные окружения
Создайте .env.local:

env

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789

NEXT_PUBLIC_SITE_URL=http://localhost:3000
На Vercel добавьте эти же переменные в Production.

Деплой на Vercel
Push в GitHub
Import project в Vercel
Добавьте env vars
Deploy
Админ-доступ
Зарегистрируйтесь на сайте
В Supabase → Table Editor → profiles
Найдите свою строку
Измените role на admin
Контент: фото психолога
Положите фото в public/:

public/photo-hero.jpg
public/photo-about.jpg
Файлы для замены плейсхолдеров:

src/components/home/Hero.tsx — фото на главной
src/components/home/AboutPreview.tsx — превью фото на главной
src/app/about/page.tsx — фото на странице “Обо мне”
Типовые проблемы и решения
1) Multiple GoTrueClient instances
Решение: использовать singleton Supabase client (src/lib/supabase.ts).

2) “Войдите снова” на /dashboard/*
Решение: /dashboard/* должен быть client-only, не server-redirect.

3) Отзывы/комменты “просят войти”, хотя вы вошли
Решение: не использовать server API, а писать напрямую в Supabase из браузера, либо внедрять cookie-SSR полностью. В данном проекте используется первый вариант + RLS.

4) Очистка после изменений auth
После крупных правок по auth на проде:

DevTools → Application → Clear site data
Лицензия
Проект можно использовать и модифицировать под свои задачи. Рекомендуется добавить свою лицензию (например MIT) при публикации.