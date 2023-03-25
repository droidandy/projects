module Manual
  class Base < ApplicationService
    # TODO: check and get rid of Context usage
    include ApplicationService::Context

    attributes :booking

    def execute!
      callbacks = ApplicationService::HttpCallbacks.new

      yield(callbacks) if block_given?

      callbacks.on_success(nil)
    end
  end
end
