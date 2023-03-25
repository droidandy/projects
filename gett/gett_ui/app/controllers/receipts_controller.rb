class ReceiptsController < ApplicationController
  def export_data
    render json: Bookings::Receipts::ExportData.new.execute.result
  end

  def export
    Bookings::Receipts::ExportBunch.new(
      periods: params[:periods],
      passenger_id: params[:passenger_id]
    ).execute

    head :ok
  end

  def download_bunch_file
    send_data Bookings::Receipts::ExportBunch.s3_zipfile_content(current_member),
      type: 'application/zip',
      disposition: 'attachment',
      filename: params[:filename]
  end
end
