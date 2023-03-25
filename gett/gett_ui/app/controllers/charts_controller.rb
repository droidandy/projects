class ChartsController < ApplicationController
  def index
    render json: Charts::Index.new(with_linked_companies: params[:with_linked_companies].to_s == 'true').execute.result
  end
end
