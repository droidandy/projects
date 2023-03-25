class WorkRolesController < ApplicationController
  def index
    render json: WorkRoles::Index.new.execute.result
  end

  def new
    render json: WorkRoles::Form.new.execute.result
  end

  def create
    service = WorkRoles::Create.new(params: work_role_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def edit
    render json: WorkRoles::Form.new(work_role: work_role).execute.result
  end

  def update
    service = WorkRoles::Update.new(work_role: work_role, params: work_role_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = WorkRoles::Destroy.new(work_role: work_role)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def work_role
    @work_role ||= current_company.work_roles_dataset.with_pk!(params[:id])
  end

  private def work_role_params
    params.require(:work_role).permit(:name, member_pks: [])
  end
end
