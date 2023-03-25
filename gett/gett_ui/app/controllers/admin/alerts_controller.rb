class Admin::AlertsController < Admin::BaseController
  def destroy
    Admin::Alerts::Destroy.new(alert_id: params[:id]).execute
    head :no_content
  end
end
