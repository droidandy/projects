class Admin::BookingReferencesController < Admin::BaseController
  def create
    service = Admin::BookingReferences::Create.new(company: company, params: booking_reference_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Admin::BookingReferences::Update.new(booking_reference: booking_reference, params: booking_reference_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def company
    @company ||= Company.with_pk!(params[:company_id])
  end

  private def booking_reference
    @booking_reference ||= BookingReference.with_pk!(params[:id])
  end

  private def booking_reference_params
    params.require(:booking_reference)
      .permit(
        :name, :active, :mandatory, :validation_required, :dropdown,
        :attachment, :priority, :sftp_server, :cost_centre, :conditional
      )
  end
end
