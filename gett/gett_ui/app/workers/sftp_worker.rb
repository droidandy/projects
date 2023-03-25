class SftpWorker < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform(company_id = nil)
    @company_id = company_id

    fail_safe { fetch_hr_feed }
    fetch_booking_references
  end

  private def fetch_hr_feed
    companies_dataset.each do |company|
      HrFeed::Fetch.new(company: company).execute
    end
  end

  private def fetch_booking_references
    booking_references_dataset.each do |booking_reference|
      fail_safe { Admin::BookingReferences::Fetch.new(booking_reference: booking_reference).execute }
    end
  end

  private def companies_dataset
    if @company_id
      Company.where(id: @company_id, hr_feed_enabled: true)
    else
      Company.active.where(hr_feed_enabled: true)
    end
  end

  private def booking_references_dataset
    if @company_id
      BookingReference.where(company_id: @company_id)
    else
      BookingReference.active.sftp
    end
  end
end
