module Mobile::V1
  class StatisticsController < ApplicationController
    def show
      render json: Statistics::Show.new.execute.result
    end
  end
end
