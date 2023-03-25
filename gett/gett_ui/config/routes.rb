require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # https://github.com/mperham/sidekiq/wiki/Monitoring#rails-http-basic-auth-from-routes
  if Rails.env.dev? || Rails.env.staging? || Rails.env.production?
    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      config = Settings.sidekiq_web
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(config.username)) &
        ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(config.password))
    end
  end

  get 'health', to: 'health_checks#show'

  mount Sidekiq::Web => '/sidekiq'

  resource :session, only: [:create, :show] do
    get :realm, :token
    put :onboard
  end

  concern :documents do
    post :company_statistics # 'post' method to accept html data in request body

    # post to transfer auth token in request body
    post :receipt
    post 'invoice:invoice_id', to: 'documents#invoice', as: :invoice_document
    post 'credit_note:credit_note_id', to: 'documents#credit_note', as: :credit_note_document
  end

  concern :exportable do
    # post to transfer auth token in request body
    member do
      post :export
    end

    collection do
      get :exportable_periods
      post :export_bunch

      post :export_csv
      post 'download_bunch/:filename' => 'invoices#download_bunch_file',
        as: :download_bunch,
        constraints: { filename: %r{[^/]+} }
    end
  end

  scope controller: 'documents', path: 'documents' do
    concerns :documents
  end

  namespace :incomings do
    post '/gete', to: 'get_e#create'
    scope controller: 'carey', path: 'carey' do
      post :trip_status, :outbound_expense
    end
    resource :payment, only: :create
    resource :go_cardless, only: :create, controller: :go_cardless
    resource :splyt, only: [], controller: :splyt do
      post :event
    end
  end

  namespace :admin do
    scope controller: 'documents', path: 'documents' do
      concerns :documents
    end

    resource :session, only: :show do
      post :reincarnate, :ascend
    end

    resources :companies, only: [:index, :create, :new, :edit, :update, :destroy] do
      put :toggle_status, on: :member
      post :verify_gett, :verify_ot, on: :collection
      get :stats, :log, on: :member
      get :lookup, on: :collection
      post :disable, on: :member

      resources :booking_references, only: [:update, :create], shallow: true do
        resources :reference_entries, only: :index
      end
      resources :comments, only: [:index, :create]
      resources :bookings, only: [:new, :create] do
        collection do
          get :references
          post :validate_references
          post :form_details
        end
      end
      resources :members, only: [] do
        put :activate_all, on: :collection
        put :toggle_notifications, on: :collection
      end
    end
    resources :pricing_rules, only: %i(index create update destroy) do
      post :copy, on: :collection
    end

    resources :bookings, except: [:destroy] do
      member do
        put :cancel, :resend_order
        get :log, :repeat
        post :timeline # post to transfer auth token in request body
        post :form_details
        put :toggle_critical_flag
      end

      collection do
        get :flights, :products
      end

      resources :messages, only: :create, controller: :booking_messages
      resources :comments, only: [:index, :create]
      resource :pricing, only: [:show, :update], controller: :booking_pricing
    end
    resources :messages, only: [:index, :create]
    resources :statistics, only: [:index]
    resources :users, only: [:create, :index, :new, :edit, :update] do
      get :verify_email, on: :collection
    end
    resources :members, only: [:index, :edit, :update] do
      member do
        get :log, :stats
        put :reinvite, :update_password
      end

      resources :addresses, controller: :passenger_addresses, only: [:create, :update, :destroy]
      resources :payment_cards, only: [:destroy] do
        put :make_default, on: :member
      end
      resources :comments, only: [:index, :create]
    end

    resources :predefined_addresses, except: [:show, :new, :edit] do
      get :validate_postal_code, on: :collection
    end

    resource :settings, only: [:edit] do
      put :update_vehicle_value, :update_ddi_phone, :update_deployment_notification
    end

    resources :invoices, only: [:index, :update, :destroy], concerns: [:exportable] do
      post :mark_as_paid, on: :member
      post :credit_note, on: :member
      post :apply_credit_note, on: :member

      resources :bookings, only: :index
    end

    resources :alerts, only: :destroy
  end

  resource :company, only: [:show, :update] do
    put :synchronize_sftp
    post :create_signup_request

    resource :settings, controller: 'company_settings', only: [:show, :update]
    resource :payment_card, controller: 'company_payment_cards', only: [:show, :update]
  end

  resource :user, only: [] do
    put :forgot_password, :reset_password, :update_password
  end

  resources :flightstats, only: [] do
    get :flights, :schedule, on: :collection
  end

  resources :bookings, except: [:destroy] do
    collection do
      get :flights, :references, :products
      post :form_details, :validate_references

      post :export # post to transfer auth token in request body
    end

    member do
      get :repeat
      put :cancel, :rate, :cancellation_reason
    end
    resources :feedbacks, only: :create, controller: :booking_feedbacks
  end

  resources :receipts, only: [] do
    collection do
      get :export_data
      post :export
      post 'download_bunch/:filename' => 'receipts#download_bunch_file',
        as: :download_bunch,
        constraints: { filename: %r{[^/]+} }
    end
  end

  resources :booking_references, only: [] do
    resources :reference_entries, only: :index
  end

  resources :bookers do
    post :export, on: :collection # post to transfer auth token in request body
    get :log, on: :member
    put :toggle_passenger, on: :member
  end

  resources :members, only: [] do
    put :reinvite, on: :member
    put :invite, on: :collection
  end

  resources :passengers, except: [:destroy] do
    resources :addresses, controller: :passenger_addresses, only: [:create, :update, :destroy]
    resources :payment_cards, only: [:create, :destroy] do
      put :make_default, on: :member
    end

    get :stats, :log, on: :member
    put :toggle_booker, on: :member
    post :calculate_excess, on: :collection

    collection do
      post :export # post to transfer auth token in request body
      post :import
    end
  end
  resources :work_roles, only: [:index, :new, :create, :edit, :update, :destroy]
  resources :departments, only: [:index, :new, :create, :edit, :update, :destroy]
  resources :travel_reasons, only: [:index, :create, :update, :destroy]
  resources :travel_rules, only: [:index, :create, :update, :destroy] do
    get :log, on: :member
    get :form, on: :collection
    put :update_priorities, on: :collection
  end
  resources :drivers, only: [] do
    get :channel, on: :collection
  end
  resources :messages, only: [:create] do
    put :mark_all_as_read, on: :collection
    get :unread, on: :collection
  end

  resource :member, only: [] do
    put :onboard
  end

  resources :invoices, only: [:index], concerns: [:exportable]

  resources :invoice_payments, only: :create do
    post :retry, on: :collection
  end

  resources :charts, only: :index

  resources :addresses, only: [:index] do
    get :geocode, on: :collection
  end

  resources :locations, only: [:index, :create, :update, :destroy] do
    put :default, on: :member
  end

  # to generate urls in emails
  root to: 'application#blank'

  resources :short_urls, only: [:show]
  resources :csv_reports, except: [:show]

  resource :direct_debit_mandate, only: [:create, :show] do
    post :complete
  end

  resource :analytics, only: [] do
    post :event
  end

  namespace :external do
    resources :bookings, only: [:index, :create, :show, :update] do
      put :cancel, on: :member
      post :vehicles, on: :collection
    end
  end

  namespace :mobile do
    namespace :v1 do
      resource :session, only: [:create, :show]

      resource :user, only: [] do
        put :forgot_password, :pass_guide
      end

      # TODO: it should be either `resources :user_devices` or `resource :user_device`
      resource :user_devices, only: [:create, :destroy]
      resource :user_locations, only: :create
      resources :sms_messages, only: [] do
        post :notify_driver, on: :collection
      end

      resources :messages, only: [] do
        get :recent, on: :collection
      end

      resources :drivers, only: [] do
        get :channel, :locations, on: :collection
      end

      resource :company, only: [] do
        post :create_signup_request

        resource :settings, controller: 'company_settings', only: [:show]
      end

      resources :addresses, only: [:index] do
        get :geocode, :quick_search, on: :collection
      end

      resources :flightstats, only: [] do
        get :flights, :schedule_states, :track, on: :collection
      end

      resources :booking_references, only: [] do
        resources :reference_entries, only: :index
      end

      resources :passengers, only: [:edit, :update] do
        resources :addresses, controller: :passenger_addresses, only: [:create, :update, :destroy]

        resources :payment_cards, only: [:create, :destroy] do
          put :make_default, on: :member
        end
      end

      resources :bookings, except: [:destroy] do
        collection do
          post :form_details, :validate_references, :vehicles
        end

        member do
          get :repeat, :reverse
          put :cancel, :rate, :cancellation_reason
        end
      end

      resource :statistics, only: :show
    end
  end
end
