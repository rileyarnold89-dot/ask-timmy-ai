-- Domain Outdoor Property Planner Database Schema
-- This creates the saved customer profile, property, soil test, fertility plan,
-- planting plan, food plot plan, and Timmy question log tables.

create extension if not exists "pgcrypto";

-- Keeps updated_at current whenever a row is edited
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Customer profile tied to Shopify customer ID
create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text not null unique,
  email text,
  first_name text,
  last_name text,
  default_state text,
  default_zip text,
  primary_goal text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger customer_profiles_set_updated_at
before update on public.customer_profiles
for each row
execute function public.set_updated_at();

-- Saved properties
create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text not null,
  property_name text not null default 'My Property',
  state text,
  zip text,
  county text,
  acres numeric,
  food_plot_acres numeric,
  equipment text,
  soil_type text,
  sunlight text,
  moisture text,
  deer_goals text,
  property_notes text,
  plan_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_properties_customer_idx
on public.saved_properties (shopify_customer_id);

create trigger saved_properties_set_updated_at
before update on public.saved_properties
for each row
execute function public.set_updated_at();

-- Saved soil tests
create table if not exists public.saved_soil_tests (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text not null,
  property_id uuid references public.saved_properties(id) on delete set null,
  test_name text not null default 'Soil Test',
  test_date date,
  crop_or_plot text,
  soil_ph numeric,
  phosphorus_ppm numeric,
  potassium_ppm numeric,
  organic_matter_percent numeric,
  nitrogen_ppm numeric,
  calcium_ppm numeric,
  magnesium_ppm numeric,
  notes text,
  raw_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_soil_tests_customer_idx
on public.saved_soil_tests (shopify_customer_id);

create index if not exists saved_soil_tests_property_idx
on public.saved_soil_tests (property_id);

create trigger saved_soil_tests_set_updated_at
before update on public.saved_soil_tests
for each row
execute function public.set_updated_at();

-- Saved fertility plans from Plot Enhancing App
create table if not exists public.saved_fertility_plans (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text not null,
  property_id uuid references public.saved_properties(id) on delete set null,
  soil_test_id uuid references public.saved_soil_tests(id) on delete set null,
  plan_name text not null default 'Fertility Plan',
  crop text,
  acres numeric,
  soil_ph numeric,
  phosphorus_ppm numeric,
  potassium_ppm numeric,
  organic_matter_percent numeric,
  target_ph numeric,
  dry_goal text,
  total_liquid_gallons numeric,
  starter_program text,
  in_season_program text,
  support_program text,
  products jsonb not null default '{}'::jsonb,
  full_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_fertility_plans_customer_idx
on public.saved_fertility_plans (shopify_customer_id);

create index if not exists saved_fertility_plans_property_idx
on public.saved_fertility_plans (property_id);

create trigger saved_fertility_plans_set_updated_at
before update on public.saved_fertility_plans
for each row
execute function public.set_updated_at();

-- Saved planting date plans from Planting Date Advisor
create table if not exists public.saved_planting_plans (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text not null,
  property_id uuid references public.saved_properties(id) on delete set null,
  plan_name text not null default 'Planting Plan',
  product_name text,
  state text,
  zip text,
  region text,
  acres numeric,
  planting_window text,
  best_dates jsonb not null default '[]'::jsonb,
  moisture_notes text,
  timing_score text,
  full_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_planting_plans_customer_idx
on public.saved_planting_plans (shopify_customer_id);

create index if not exists saved_planting_plans_property_idx
on public.saved_planting_plans (property_id);

create trigger saved_planting_plans_set_updated_at
before update on public.saved_planting_plans
for each row
execute function public.set_updated_at();

-- Saved food plot recommendations from Food Plot Selector
create table if not exists public.saved_food_plot_plans (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text not null,
  property_id uuid references public.saved_properties(id) on delete set null,
  plan_name text not null default 'Food Plot Plan',
  goal text,
  state text,
  zip text,
  acres numeric,
  soil_condition text,
  sunlight text,
  equipment text,
  recommendations jsonb not null default '[]'::jsonb,
  full_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_food_plot_plans_customer_idx
on public.saved_food_plot_plans (shopify_customer_id);

create index if not exists saved_food_plot_plans_property_idx
on public.saved_food_plot_plans (property_id);

create trigger saved_food_plot_plans_set_updated_at
before update on public.saved_food_plot_plans
for each row
execute function public.set_updated_at();

-- Saved Timmy answers / customer question history
create table if not exists public.saved_timmy_answers (
  id uuid primary key default gen_random_uuid(),
  shopify_customer_id text,
  property_id uuid references public.saved_properties(id) on delete set null,
  question text not null,
  answer text,
  intent text,
  question_type text,
  products jsonb not null default '[]'::jsonb,
  acres numeric,
  region text,
  blog_ideas jsonb not null default '[]'::jsonb,
  full_log jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists saved_timmy_answers_customer_idx
on public.saved_timmy_answers (shopify_customer_id);

create index if not exists saved_timmy_answers_created_idx
on public.saved_timmy_answers (created_at desc);

-- Enable Row Level Security.
-- We will use the Vercel backend with the Supabase service role key,
-- so customers will not directly access these tables from public website JavaScript.
alter table public.customer_profiles enable row level security;
alter table public.saved_properties enable row level security;
alter table public.saved_soil_tests enable row level security;
alter table public.saved_fertility_plans enable row level security;
alter table public.saved_planting_plans enable row level security;
alter table public.saved_food_plot_plans enable row level security;
alter table public.saved_timmy_answers enable row level security;

-- No public RLS policies are created here on purpose.
-- The Vercel backend will securely read/write using the service role key.