class Admin::InvoicesController < Admin::BaseController
  def index
    render json: Admin::Invoices::Index.new(query: query_params).execute.result
  end

  def mark_as_paid
    if Admin::Invoices::MarkAsPaid.new(invoice: invoice, partial_pay_amount: params[:partial_pay_amount]).execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def update
    service = Admin::Invoices::Update.new(invoice: invoice, params: invoice_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def export
    send_data(
      ::Invoices::Export.new(invoice: invoice).execute.result,
      filename: "invoice-#{invoice.id}.csv",
      type: 'text/csv'
    )
  end

  def export_bunch
    Admin::Invoices::ExportBunch.new(periods: params[:periods]).execute
    head :ok
  end

  def download_bunch_file
    send_data Admin::Invoices::ExportBunch.s3_zipfile_content(current_user),
      type: 'application/zip',
      disposition: 'attachment',
      filename: params[:filename]
  end

  def exportable_periods
    render json: Admin::Invoices::ExportablePeriods.new.execute.result
  end

  def export_csv
    zip_path = Admin::Invoices::ExportCSV.new(periods: params[:periods]).execute.result
    send_data zip_path, type: 'text/csv', disposition: 'attachment', filename: "invoicing_data.csv"
  end

  def credit_note
    service = Admin::Invoices::IssueCreditNote.new(
      invoice: invoice,
      credit_note_lines: credit_note_params[:credit_note_lines]
    )

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def apply_credit_note
    service = Admin::Invoices::ApplyCreditNote.new(invoice: invoice)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def destroy
    if Admin::Invoices::Destroy.new(invoice: invoice).execute.success?
      head :no_content
    else
      head :unprocessable_entity
    end
  end

  private def invoice
    @invoice ||= Invoice.with_pk!(params[:id])
  end

  private def query_params
    params.permit(:page, :company_id, :status, :type, :from_date, :to_date, :overdue_by, :invoice_id)
  end

  private def credit_note_params
    params.require(:credit_note).permit(
      credit_note_lines: [:booking_id, :amount, :vatable]
    )
  end

  private def invoice_params
    params.require(:invoice).permit(:under_review)
  end
end
