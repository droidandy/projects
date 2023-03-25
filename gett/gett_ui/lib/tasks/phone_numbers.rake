# Rake task for migrating phone numbers to international format
#  Will be migrated:
#    Member phone
#    Member mobile
#  which starts with:
#    '01', '02', '03', '07', '20', '84', '44', '97'
#
# Example:
#   bin/rake phone_numbers:internationalize | tee migration_log.txt
#
namespace :phone_numbers do
  desc 'Migrate phone numbers to international format'
  task internationalize: :environment do
    PhoneNumbersInternationalizer.new.execute
  end
end

class PhoneNumbersInternationalizer
  def execute
    puts 'Migration started'

    Member.order(:id).paged_each do |member|
      orig_phone = member.phone
      orig_mobile = member.mobile
      migr_phone = ::PhoneNumbers::Internationalizer.new(phone_number: orig_phone).execute.result
      migr_mobile = ::PhoneNumbers::Internationalizer.new(phone_number: orig_mobile).execute.result

      phone_migrated = orig_phone != migr_phone
      mobile_migrated = orig_mobile != migr_mobile

      print("#{member.id},")

      member.update(
        phone: migr_phone,
        mobile: migr_mobile
      )

      print(phone_migrated ? "#{orig_phone},#{migr_phone}," : ',,')
      print(mobile_migrated ? "#{orig_mobile},#{migr_mobile}," : ',,')

      status = (phone_migrated || mobile_migrated) ? 'migrated' : 'skipped'

      puts(status)
    end

    puts 'Migration completed'
  end
end
