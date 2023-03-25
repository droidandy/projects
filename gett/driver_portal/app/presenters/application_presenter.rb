require 'presenter_for'

class ApplicationPresenter
  include PresenterFor

  def initialize(record)
    @record = record
  end

  def as_json
    convert_to_json(@record)
  end

  protected def convert_to_json(record, params = {})
    json = record.as_json(params)
    yield json if block_given?
    json.deep_symbolize_keys.delete_if { |_, v| v.nil? }
  end
end
