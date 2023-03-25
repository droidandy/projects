Rails.application.routes.draw do
  namespace :api, format: false do
    namespace :v1 do
      scope :test do
        get '/', to: 'test#test'
      end
    end
  end
end
