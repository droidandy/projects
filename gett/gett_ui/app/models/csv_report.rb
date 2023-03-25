class CsvReport < Sequel::Model
  plugin :application_model

  many_to_one :company

  def validate
    super
    validates_presence [:name, :recurrence, :recurrence_starts_at, :recipients, :headers]
    validates_unique(:name) { |ds| ds.where(company_id: company_id) }
    validates_comma_separated_emails :recipients
  end

  def headers
    Hashie::Mash.new(super)
  end

  def recipient_emails
    recipients.strip.split(',').each(&:strip)
  end

  def scheduled_jobs
    Sidekiq::ScheduledSet.new.select do |job|
      job.klass == CsvReportSender.to_s && job.args == [id]
    end
  end

  def next_occurrence
    schedule.next_occurrence(Time.current)
  end

  private def schedule
    ::IceCube::Schedule.new(recurrence_starts_at.to_time) do |s|
      s.add_recurrence_rule(IceCube::Rule.public_send(recurrence))
    end
  end
end

# Table: csv_reports
# Columns:
#  id                   | integer                     | PRIMARY KEY DEFAULT nextval('csv_reports_id_seq'::regclass)
#  company_id           | integer                     | NOT NULL
#  recurrence           | csv_report_recurrence       | NOT NULL DEFAULT 'monthly'::csv_report_recurrence
#  recurrence_starts_at | timestamp without time zone | NOT NULL
#  name                 | text                        | NOT NULL
#  delimiter            | text                        | DEFAULT ','::text
#  recipients           | text                        | NOT NULL
#  headers              | hstore                      |
#  created_at           | timestamp without time zone | NOT NULL
#  updated_at           | timestamp without time zone | NOT NULL
# Indexes:
#  csv_reports_pkey                  | PRIMARY KEY btree (id)
#  csv_reports_company_id_name_index | UNIQUE btree (company_id, name)
# Foreign key constraints:
#  csv_reports_company_id_fkey | (company_id) REFERENCES companies(id)
