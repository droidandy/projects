class TravelRulesController < ApplicationController
  def index
    render json: TravelRules::Index.new.execute.result
  end

  def create
    service = TravelRules::Create.new(params: travel_rule_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = TravelRules::Update.new(travel_rule: travel_rule, params: travel_rule_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def form
    render json: TravelRules::Form.new.execute.result
  end

  def destroy
    service = TravelRules::Destroy.new(travel_rule: travel_rule)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update_priorities
    # params contains sorted array of rule ids
    service = TravelRules::UpdatePriorities.new(ordered_ids: params[:priorities])

    if service.execute.success?
      head :ok
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def log
    render json: TravelRules::AuditLog.new(travel_rule: travel_rule).execute.result
  end

  private def travel_rule
    @travel_rule ||= current_company.travel_rules_dataset.with_pk(params[:id])
  end

  private def travel_rule_params
    # weekdays is an Array of integers with selected days of week starting from monday [1, 5, 7]
    params.require(:travel_rule).permit(
      :name, :min_distance, :max_distance, :location, :allow_unregistered,
      :min_time, :max_time, :cheapest, :active,
      weekdays: [], department_pks: [], member_pks: [], work_role_pks: [], vehicle_pks: []
    )
  end
end
