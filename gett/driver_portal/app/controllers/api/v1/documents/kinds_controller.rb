module Api
  module V1
    module Documents
      class KindsController < ApplicationController
        before_action :authenticate_user!

        def index
          search = ::Documents::Kinds::Search.new({}, current_user: current_user)

          render json: ::Documents::Kinds::Index.new(search.resolved_scope).as_json
        end
      end
    end
  end
end
