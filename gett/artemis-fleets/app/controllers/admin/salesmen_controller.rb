class Admin::SalesmenController < Admin::BaseController
  def index
    service = Admin::Salesmen::Index.new
    service.execute!
    render json: service.result
  end
end
