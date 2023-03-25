namespace :companies do
  # Examples:
  #
  # for all companies:    bin/rails companies:sync_special_requirements
  # for specific company: bin/rails companies:sync_special_requirements[1]
  #
  desc 'Sync special requirements for all companies (or specific company)'
  task :sync_special_requirements, [:company_id] => :environment do |_, args|
    companies =
      if args[:company_id].present?
        [Company.with_pk!(args[:company_id])]
      else
        Company.where(company_type: Company::Type::ENTERPRISE_TYPES)
      end

    companies.each do |company|
      if company.ot_username.blank? || company.ot_client_number.blank?
        puts "WARN: Company##{company.id} doesn't have OT connection options"
        next
      end

      Companies::SyncSpecialRequirements.new(company: company).execute

      puts "Special requirements for Company##{company.id} updated"
    end

    puts 'Synchronization finished'
  end
end
