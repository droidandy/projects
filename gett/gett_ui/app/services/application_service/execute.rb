class ApplicationService
  DoubleResultError = Class.new(StandardError)

  module Execute
    def execute(**attribute_overrides)
      assert_allowed_attributes!(attribute_overrides.keys)
      @attributes.merge!(attribute_overrides)

      result =
        if defined?(super)
          super
        else
          block_given? ? execute!(&Proc.new) : execute!
        end

      @result = result unless @result_has_been_called || defined?(@result)
    end

    def result
      return @result unless block_given?

      if @result_has_been_called
        fail DoubleResultError, "only one result block is allowed per #execute! method"
      end

      @result_has_been_called = true
      @result = yield
    end

    def assert
      @result = false unless yield
    end

    def success!
      result { true }
    end

    def fail!
      @result = false
    end

    def success?
      !!@result
    end

    def executed?
      !!@executed
    end

    private def delegate_execution_to(service)
      if service.execute.success?
        result { service.result }
      else
        set_errors(service.errors)
      end
    end
  end
end
