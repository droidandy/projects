module Statements
  class Index < ApplicationPresenter
    attr_reader :statements

    def initialize(statements, page, per_page)
      @statements = statements
      @page = page
      @per_page = per_page
    end

    def as_json
      {
        statements: @statements.map { |statement| Statements::Show.new(statement).as_json },
        page: @page,
        per_page: @per_page
      }
    end
  end
end
