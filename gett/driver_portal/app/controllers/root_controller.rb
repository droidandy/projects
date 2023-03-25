class RootController < ApplicationController
  def welcome
    render json: {
      message: 'It Works!'
    }
  end
end
