module Incomings
  module Splyt
    class DummyEventHandler < ApplicationService
      private def execute!
        success!
      end
    end
  end
end
