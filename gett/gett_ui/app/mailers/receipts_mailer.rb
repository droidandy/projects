require 's3_tmp_file'

class ReceiptsMailer < ApplicationMailer
  def receipts_for_passenger(passenger, params)
    prepare_email_data(params)
    @passenger = @user = passenger

    mail to: passenger.email, subject: 'Your weekly Gett Business Solutions powered by One Transport Credit/Debit Card Receipts'
  end

  def receipts_for_booker(booker, passenger, params)
    prepare_email_data(params)

    @booker = @user = booker
    @passenger = passenger

    mail to: booker.email, subject: "Weekly #{passenger.full_name} Gett Business Solutions powered by One Transport Credit/Debit Card Receipts"
  end

  private def prepare_email_data(params)
    zip_path, @from_date, @to_date = params.values_at(:zip_path, :from_date, :to_date)
    attachments[File.basename(zip_path)] = S3TmpFile.read(zip_path)
  end
end
