class ImportMailer < ApplicationMailer
  default to: 'anton.macius@gett.com'.freeze,
          cc: ['akorenev@sphereinc.com'.freeze, 'adesh.bussooa@gett.com'.freeze].freeze,
          subject: 'HR Feed Error'.freeze

  def error_report(company_id, line_errors, encoding_error_present)
    @company = Company.with_pk!(company_id)
    @line_errors = (line_errors || []).map(&:symbolize_keys!)
    @encoding_error_present = encoding_error_present
    @user = OpenStruct.new(enterprise: true)

    mail
  end
end
