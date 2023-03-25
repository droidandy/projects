class Export::OrdersReportCsv < Export::CreateCsv
  def initialize(user, fleet_id, params)
    @user = user
    @fleet_id = fleet_id
    @from = params[:from]
    @to = params[:to]
  end

  attr_reader :user, :fleet_id, :from, :to, :result

  def execute!
    if action_allowed?
      build_result
    else
      raise RuntimeError
    end
  end

  def file_name
    "Orders #{from} - #{to}.csv"
  end

  private def build_result
    request = OrdersReportRequest.new(fleet_id)
    request.from_date = parse_date(from)
    request.to_date = parse_date(to)

    csv_service = Export::CreateCsv.new(request.remote_records, request.columns)
    csv_service.execute!
    @result = csv_service.result
  end

  private def parse_date(string)
    Date.strptime(string, '%d-%m-%Y')
  end

  private def action_allowed?
    user.admin?
  end
end
