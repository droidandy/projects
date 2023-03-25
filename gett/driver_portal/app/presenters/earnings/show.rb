module Earnings
  class Show < ApplicationPresenter
    attr_reader :earning

    def initialize(earning)
      @earning = earning
    end

    def as_json
      convert_to_json(earning)
    end
  end
end
