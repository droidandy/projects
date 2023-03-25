class OrdersReportController < ApplicationController
  def export
    service = Export::OrdersReportCsv.new(current_user, current_company.fleet_id, export_params)
    service.execute!

    send_data(
      service.result,
      filename: service.file_name,
      type: 'text/csv'
    )
  end

  private def export_params
    params.permit(:from, :to)
  end
end
