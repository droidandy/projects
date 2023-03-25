module GoCardlessClientBuilder
  def self.build
    params = {
      access_token: Settings.go_cardless.access_token
    }

    unless Rails.env.production?
      params[:environment] = :sandbox
    end

    GoCardlessPro::Client.new(params)
  end
end
