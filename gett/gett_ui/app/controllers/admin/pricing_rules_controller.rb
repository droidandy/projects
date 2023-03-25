class Admin::PricingRulesController < Admin::BaseController
  def index
    render json: Admin::PricingRules::Index.new(company_id: params[:company_id]).execute.result
  end

  def create
    service = Admin::PricingRules::Create.new(params: pricing_rule_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Admin::PricingRules::Update.new(pricing_rule: pricing_rule, params: pricing_rule_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = Admin::PricingRules::Destroy.new(pricing_rule: pricing_rule)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def copy
    service = Admin::PricingRules::Copy.new(target_id: params[:target_id], source_id: params[:source_id])

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def pricing_rule_params
    address_fields = %i(
      lat lng postal_code country_code line timezone city region
    )
    params.require(:rule).permit(
      :company_id,
      :name,
      :active,
      :rule_type,
      :price_type,
      :booking_type,
      :min_time,
      :max_time,
      :base_fare,
      :initial_cost,
      :after_distance,
      :after_cost,
      :time_frame,
      :starting_at,
      :ending_at,
      pickup_address: address_fields,
      destination_address: address_fields,
      pickup_polygon: %i(lat lng),
      destination_polygon: %i(lat lng),
      vehicle_types: []
    )
  end

  private def pricing_rule
    @pricing_rule ||= PricingRule.with_pk!(params[:id])
  end
end
