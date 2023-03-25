module Earnings
  class Index < ApplicationPresenter
    attr_reader :earnings

    def initialize(earnings, page, per_page)
      @earnings = earnings
      @page = page
      @per_page = per_page
    end

    def as_json
      {
        earnings: @earnings.map { |earning| Earnings::Show.new(earning).as_json },
        page: @page,
        per_page: @per_page
      }
    end
  end
end
