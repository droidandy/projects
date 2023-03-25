class DirectDebitMandatesController < ApplicationController
  def show
    render json: DirectDebitMandates::Show.new.execute.result
  end

  def create
    service = DirectDebitMandates::Create.new
    if service.execute.success?
      render json: {redirect_url: service.result}
    else
      head :unprocessable_entity
    end
  end

  def complete
    service = DirectDebitMandates::Complete.new(redirect_flow_id: params[:redirect_flow_id])
    if service.execute.success?
      render json: service.result
    else
      head :unprocessable_entity
    end
  end
end
