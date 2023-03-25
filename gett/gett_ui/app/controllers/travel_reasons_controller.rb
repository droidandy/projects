class TravelReasonsController < ApplicationController
  def index
    render json: TravelReasons::Index.new.execute.result
  end

  def create
    service = TravelReasons::Create.new(params: travel_reason_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = TravelReasons::Update.new(travel_reason: travel_reason, params: travel_reason_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = TravelReasons::Destroy.new(travel_reason: travel_reason)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def travel_reason
    @travel_reason ||= current_company.travel_reasons_dataset.with_pk!(params[:id])
  end

  private def travel_reason_params
    params.require(:travel_reason).permit(:name, :active)
  end
end
