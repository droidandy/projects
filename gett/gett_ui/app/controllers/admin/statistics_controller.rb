class Admin::StatisticsController < Admin::BaseController
  def index
    render json: Admin::Statistics::Index.new.execute.result
  end
end
