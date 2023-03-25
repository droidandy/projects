Rails.application.routes.draw do
  root to: 'application#blank'

  resources :sessions, only: :create do
    get :current, on: :collection
  end

  resource :user, only: [] do
    put :forgot_password, :reset_password, :update_password
    get :check_token
  end

  resources :members

  resource :company, only: [:show, :update] do
    resource :settings, controller: 'company_settings', only: [:show, :update]
  end

  namespace :admin do
    resources :companies, only: [:index, :create, :edit, :update, :destroy] do
      put :toggle_status, on: :member
    end

    resources :messages, only: [:index, :create]

    resources :salesmen, only: [:index]
  end

  resources :orders_report, only: [] do
    get :export, on: :collection
  end

  resources :messages, only: [:create] do
    put :mark_all_as_read, on: :collection
    get :unread, on: :collection
  end

  get 'flightstats/schedule' => 'flightstats#schedule'

  resources :active_orders, only: :index
  resources :completed_orders, only: %i(index show)
  resources :future_orders, only: :index
  resources :all_orders, only: :index
  resources :driver_locations, only: :index
  resources :driver_reports, only: :index
  resources :fleet_reports, only: :index
end
