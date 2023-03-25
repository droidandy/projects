# This is base class to any service.
class BaseService
  attr_reader :result, :context, :params, :errors

  def execute
    execute!
    self
  end

  # context Hash
  # params Hash
  def initialize(context, params = {})
    @context = OpenStruct.new(context)
    @errors  = {}
    @params  = OpenStruct.new(params)
  end

  def result
    return @result unless block_given?

    if @result_has_been_called
      fail DoubleResultError, "only one result block is allowed per #execute! method"
    end

    @result_has_been_called = true
    @result = yield
  end

  def success?
    result && errors.empty?
  end
end
