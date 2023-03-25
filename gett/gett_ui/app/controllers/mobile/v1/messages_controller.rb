module Mobile::V1
  class MessagesController < ApplicationController
    def recent
      render json: Mobile::V1::Messages::Recent.new.execute.result
    end
  end
end
