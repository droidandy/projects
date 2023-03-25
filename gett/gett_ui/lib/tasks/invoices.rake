namespace :invoices do
  desc 'Generate an invoice for a single company with custom billing period'
  task :generate, [:company_id, :billing_period_start, :billing_period_end] => :environment do |_, args|
    companies = (args[:company_id] == 'enterprise') ? Company.enterprise.all : [Company.with_pk!(args[:company_id])]

    companies.each do |company|
      if company.invoicing_schedule.blank? || company.payment_terms.blank?
        puts "WARN: Company##{company.id} does not have defined #invoicing_schedule or #payment_terms. Skipping..."
        next
      end

      billing_period_start = Date.parse(args[:billing_period_start])
        .to_time.in_time_zone(Settings.time_zone).beginning_of_day
      billing_period_end = Date.parse(args[:billing_period_end])
        .to_time.in_time_zone(Settings.time_zone).end_of_day
      billing_period = billing_period_start..billing_period_end
      Invoices::Create.new(company: company, custom_billing_period: billing_period).execute
    end
  end
end
