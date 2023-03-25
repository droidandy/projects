class InvoicePaymentsController < ApplicationController
  def create
    service = InvoicePayments::CreateManual.new(
      card_token: payment_params[:payment_card][:token],
      invoice_ids: payment_params[:invoice_ids]
    )

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def retry
    service = InvoicePayments::Retry.new
    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def payment_params
    params.require(:payment).permit(
      invoice_ids: [],
      payment_card: [:token, :holder_name]
    )
  end
end
