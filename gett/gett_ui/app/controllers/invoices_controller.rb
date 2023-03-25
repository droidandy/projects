class InvoicesController < ApplicationController
  include ActionController::Cookies

  after_action :set_download_cookie

  def index
    render json: Invoices::Index.new.execute.result
  end

  def export
    send_data(
      Invoices::Export.new(invoice: invoice).execute.result,
      filename: "invoice-#{invoice.id}.csv",
      type: 'text/csv'
    )
  end

  def export_bunch
    Invoices::ExportBunch.new(periods: params[:periods], company: company).execute
    head :ok
  end

  def download_bunch_file
    send_data Invoices::ExportBunch.s3_zipfile_content(current_user),
      type: 'application/zip',
      disposition: 'attachment',
      filename: params[:filename]
  end

  def exportable_periods
    render json: Invoices::ExportablePeriods.new.execute.result
  end

  def export_csv
    zip_path = Invoices::ExportCSV.new(periods: params[:periods]).execute.result
    send_data zip_path, type: 'text/csv', disposition: 'attachment', filename: "invoicing_data.csv"
  end

  def invoice
    current_company.invoices_dataset.with_pk!(params[:id])
  end

  private def set_download_cookie
    return if params[:download_token].blank?

    cookies[:download_token] = params[:download_token]
  end

  private def company
    current_company
  end
end
