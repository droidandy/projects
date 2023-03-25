module Api::V1::Assignment
  class AgentsController < ApplicationController
    before_action :authenticate_user!

    def index
      search = ::Users::Search.new(index_params, current_user: current_user)
      render json: ::Agents::Index.new(search.resolved_scope).as_json
    end

    def assign_driver
      service = Agents::AssignDriver.new(current_user, assign_driver_params)

      execute_and_process(service) do
        render json: ::Users::Assignment::Show.new(service.driver).as_json
      end
    end

    def change_status
      service = Agents::ChangeStatus.new(current_user, change_status_params)
      execute_and_process(service)
    end

    private def index_params
      {
        page: params[:page] || 1,
        per_page: params[:per_page] || 10,
        role: Role::ONBOARDING_AGENTS,
        sort_column: 'agent_status',
        sort_direction: 'asc'
      }
    end

    private def assign_driver_params
      {
        agent_id: params[:id],
        driver_id: params[:driver_id]
      }
    end

    private def change_status_params
      {
        status: params[:status]
      }
    end
  end
end
