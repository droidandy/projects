module PaymentsOS
  class CreateToken < Base
    http_method :post

    attributes :card_params

    def execute!
      make_request!
      response.data['token'] if response.success?
    end

    def url
      super("tokens")
    end

    def params
      {
        type:            card_params[:type] || 'credit_card',
        card_number:     card_params[:card_number],
        expiration_date: expiration_date,
        holder_name:     card_params[:holder_name],
        cvv:             card_params[:cvv]
      }
    end

    private def expiration_date
      [
        card_params[:expiration_month].to_s.rjust(2, "0"),
        card_params[:expiration_year]
      ].join('/')
    end
  end
end
