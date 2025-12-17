/*
  # Create Projects Table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `work` (text) - Project name/description
      - `priority` (text) - Priority level (High, Medium, Low)
      - `status` (text) - Current status (TO DO, PAUSED, COMPLETED, IN PROGRESS)
      - `created_at` (timestamptz) - Creation date
      - `updated_at` (timestamptz) - Last update date
      - `created_by` (text) - Creator identifier
      - `updated_by` (text) - Last updater identifier

  2. Security
    - Enable RLS on `projects` table
    - Add policy for public read access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work text NOT NULL,
  priority text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'TO DO',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by text DEFAULT 'System',
  updated_by text DEFAULT 'System'
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to projects"
  ON projects
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to projects"
  ON projects
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO projects (work, priority, status, created_at, updated_at)
VALUES
  ('Distribution Gap Analysis', 'Medium', 'TO DO', '2024-12-15', '2024-12-17'),
  ('Pandadoc Templates : PO/PT/CI Invoices', 'Medium', 'PAUSED', '2024-12-10', '2024-12-16'),
  ('Quickbooks Sandbox development & integrati...', 'Medium', 'TO DO', '2024-12-12', '2024-12-17'),
  ('Tableau Demo', 'Medium', 'TO DO', '2024-12-08', '2024-12-15'),
  ('VALUE CHAIN FEEDBACK', 'Medium', 'TO DO', '2024-12-14', '2024-12-16'),
  ('Customer & Vendor Onboarding form', 'High', 'COMPLETED', '2024-12-05', '2024-12-14'),
  ('Value Chain Fix for Incoterms Pricing', 'Medium', 'TO DO', '2024-12-11', '2024-12-17');