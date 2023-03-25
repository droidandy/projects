class DepartmentsController < ApplicationController
  def index
    render json: Departments::Index.new.execute.result
  end

  def new
    render json: Departments::Form.new.execute.result
  end

  def create
    service = Departments::Create.new(params: department_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def edit
    render json: Departments::Form.new(department: department).execute.result
  end

  def update
    service = Departments::Update.new(department: department, params: department_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = Departments::Destroy.new(department: department)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def department
    @department ||= current_company.departments_dataset.with_pk!(params[:id])
  end

  private def department_params
    params.require(:department).permit(:name, member_pks: [])
  end
end
