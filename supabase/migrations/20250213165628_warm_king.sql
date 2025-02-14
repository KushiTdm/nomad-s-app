/*
  # Facilitateur Database Schema

  1. New Tables
    - countries: Core country information
    - entry_requirements: Visa and entry requirements
    - vaccines: Required and recommended vaccinations
    - customs_restrictions: Prohibited items and rules
    - estimated_budget: Cost estimates for accommodation, transport, and meals
    - real_time_alerts: Political, health, and climate risks
    - emergency_contacts: Emergency numbers and embassy contacts
    - currency: Local currency and exchange rates
    - payment_methods: Accepted payment methods
    - languages_spoken: Official and common languages
    - dominant_religions: Religious demographics
    - local_laws_customs: Important laws and customs
    - survival_phrasebook: Essential phrases
    - sim_esim: Mobile connectivity options

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated read access
    - Secure foreign key relationships
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    passport_validity TEXT,
    time_zone TEXT,
    climate TEXT,
    image TEXT
);

-- Entry requirements table
CREATE TABLE IF NOT EXISTS entry_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    visa_required BOOLEAN,
    visa_duration TEXT,
    visa_cost TEXT,
    e_visa_available BOOLEAN,
    exemptions TEXT
);

-- Vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('mandatory', 'recommended')),
    vaccine_name TEXT
);

-- Customs restrictions table
CREATE TABLE IF NOT EXISTS customs_restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    prohibited_items TEXT[],
    specific_rules TEXT
);

-- Estimated budget table
CREATE TABLE IF NOT EXISTS estimated_budget (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    accommodation TEXT,
    transport TEXT,
    meals TEXT
);

-- Real-time alerts table
CREATE TABLE IF NOT EXISTS real_time_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    political_risks TEXT,
    health_risks TEXT,
    climate_risks TEXT
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    police TEXT,
    ambulance TEXT,
    french_embassy_email TEXT
);

-- Currency table
CREATE TABLE IF NOT EXISTS currency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    local_currency TEXT,
    exchange_rate TEXT
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    credit_card BOOLEAN,
    cash BOOLEAN,
    crypto BOOLEAN,
    apple_pay BOOLEAN
);

-- Languages spoken table
CREATE TABLE IF NOT EXISTS languages_spoken (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    language TEXT
);

-- Dominant religions table
CREATE TABLE IF NOT EXISTS dominant_religions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    religion TEXT
);

-- Local laws and customs table
CREATE TABLE IF NOT EXISTS local_laws_customs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    main_rules TEXT[]
);

-- Survival phrasebook table
CREATE TABLE IF NOT EXISTS survival_phrasebook (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    english TEXT,
    translation TEXT
);

-- SIM/eSIM table
CREATE TABLE IF NOT EXISTS sim_esim (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    providers TEXT[],
    budget TEXT
);

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE customs_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimated_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages_spoken ENABLE ROW LEVEL SECURITY;
ALTER TABLE dominant_religions ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_laws_customs ENABLE ROW LEVEL SECURITY;
ALTER TABLE survival_phrasebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_esim ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for authenticated read access
CREATE POLICY "Allow authenticated read" ON countries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON entry_requirements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON vaccines FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON customs_restrictions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON estimated_budget FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON real_time_alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON emergency_contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON currency FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON payment_methods FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON languages_spoken FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON dominant_religions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON local_laws_customs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON survival_phrasebook FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON sim_esim FOR SELECT USING (auth.role() = 'authenticated');