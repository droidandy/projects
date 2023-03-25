class Admin::CompaniesController < Admin::BaseController
  def index
    service = Admin::Companies::Index.new
    service.execute!
    render json: service.result
  end

  def edit
    service = Admin::Companies::Edit.new(company)
    service.execute!
    render json: service.result
  end

  def create
    service = Admin::Companies::Create.new(company_params)
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Admin::Companies::Update.new(company, company_params)
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def toggle_status
    Admin::Companies::ToggleStatus.new(company).execute!
    head :ok
  end

  def destroy
    service = Admin::Companies::Destroy.new(company)
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def company
    Company.find(params[:id])
  end

  private def company_params
    params.require(:company)
      .permit(
        :name,
        :vat_number,
        :cost_centre,
        :legal_name,
        :salesman_id,
        :logo,
        :fleet_id,
        address: [
          :line,
          :lat,
          :lng,
          :postal_code
        ],
        legal_address: [
          :line,
          :lat,
          :lng,
          :postal_code
        ],
        admin: [
          :first_name,
          :last_name,
          :phone,
          :email,
          :password
        ]
      )
  end
end
