module Shared::DocumentsController
  extend ActiveSupport::Concern

  include ActionController::MimeResponds
  include ActionController::Cookies

  included do
    after_action :set_download_cookie
  end

  def invoice
    render_document(Documents::Invoice.new(invoice_id: params[:invoice_id]))
  end

  def credit_note
    render_document(Documents::CreditNote.new(credit_note_id: params[:credit_note_id]))
  end

  def receipt
    render_document(Documents::Receipt.new(booking_id: params[:booking_id]))
  end

  def company_statistics
    render_document(Documents::CompanyStatistics.new(html: params[:html]))
  end

  private def render_document(service)
    respond_to do |format|
      format.html { render plain: service.execute(format: :html).result }
      format.pdf do
        send_data(
          service.execute(format: :pdf).result,
          filename: "#{service.filename}.pdf",
          disposition: 'inline'
        )
      end
    end
  end

  private def set_download_cookie
    return if params[:download_token].blank?

    cookies[:download_token] = params[:download_token]
  end
end
