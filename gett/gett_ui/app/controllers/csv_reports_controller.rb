class CsvReportsController < ApplicationController
  def index
    render json: CsvReports::Index.new.execute.result
  end

  def new
    render json: CsvReports::Form.new.execute.result
  end

  def create
    service = CsvReports::Create.new(params: csv_report_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def edit
    render json: CsvReports::Form.new(csv_report: csv_report).execute.result
  end

  def update
    service = CsvReports::Update.new(csv_report: csv_report, params: csv_report_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = CsvReports::Destroy.new(csv_report: csv_report)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def csv_report
    @csv_report ||= CsvReport[params[:id]]
  end

  private def csv_report_params
    params.require(:csv_report)
      .permit(
        :recurrence_starts_at, :name, :delimiter, :recurrence, :recipients,
        headers: supported_headers
      )
      .tap{ |prms| prms[:headers]&.reject!{ |_key, value| !value } }
  end

  private def supported_headers
    CsvReports::Export::SUPPORTED_HEADERS.keys << CsvReports::Export::SUPPORTED_REFERENCES_HEADERS_KEY
  end
end
