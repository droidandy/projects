module Messages
  class Show < InternalService
    def execute!
      data = params.message.as_json(only: [:id, :body, :title, :created_at, :sender_id])

      if params.message.internal?
        data[:title]  = params.message.sender.full_name
        data[:avatar] = params.message.sender.avatar
      end

      result { data }
    end
  end
end
