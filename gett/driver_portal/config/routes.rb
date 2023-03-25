Rails.application.routes.draw do
  root to: 'root#welcome'

  namespace :api do
    namespace :v1 do
      root to: 'root#welcome'
      post 'tokens', to: 'tokens#create'
      post 'tokens/:token/exchange', to: 'tokens#exchange'
      resource :session, only: %i[show create update] do
        get :stats, to: 'stats#current'
        get :metrics, to: 'metrics#current'
        get :total_distance, to: 'orders#current_distance'
        put :avatar, to: 'sessions#upload_avatar'
        resources :documents, only: %i[index create], module: :session
        resources :vehicles, only: %i[index create update destroy], module: :session do
          post :set_as_current, on: :member

          resources :documents, only: %i[create], module: :vehicles
        end
      end
      resources :users, only: %i[index show create] do
        collection do
          post '/invites', to: 'invites#batch_create'
          post '/activate', to: 'users#batch_activate'
          post '/deactivate', to: 'users#batch_deactivate'
          get '/drivers', action: :drivers
          post '/approval/start', to: 'users/approval#start'
        end
        member do
          post '/invites', to: 'invites#create'
          post :activate
          post :deactivate
          post :log_in_as
          get :stats, to: 'stats#index'
          get :metrics, to: 'metrics#index'
          get :total_distance, to: 'orders#distance'
          get :avatar
          get '/approval/notification', to: 'users/approval#notification'
          post '/approval/pick', to: 'users/approval#pick'
          post '/approval/drop', to: 'users/approval#drop'
          post '/approval/finish', to: 'users/approval#finish'
        end

        collection do
          post :sync
        end

        resources :documents, only: %i[index], module: :users do
          get :kinds, on: :collection
          member do
            post :approve
            post :reject
          end
        end

        resources :vehicles, only: %i[index update], module: :users do
          resources :documents, only: %i[index], module: :vehicles do
            get :kinds, on: :collection
            member do
              post :approve
              post :reject
            end
          end
        end

        resource :review, only: [], module: :users do
          get :history
          get :stats
          post :approve
          post :reject
          post '/:requirement/approve', action: 'approve_item'
          post '/:requirement/reject', action: 'reject_item'
        end
      end
      namespace :assignment, only: [] do
        resources :drivers, only: %i[index] do
          member do
            post :check_in
            post :check_identity
          end
        end
      end
      get '/session/assignment/drivers', to: 'assignment/drivers#assigned_to_me'
      resource :onboarding, only: :update
      resources :admins, only: %i[create update]
      resources :earnings, only: %i[index] do
        collection do
          post :generate_csv
          post :email_me
          post :share
        end
      end
      resources :statements, only: %i[index] do
        collection do
          post :generate_pdf
          post :email_me
          post :share
          get :by_date
        end
      end
      resources :orders, only: %i[show]
      resources :statistics, only: [] do
        collection do
          get '/daily/:type', action: :daily
          get '/monthly/:type', action: :monthly
        end
      end
      namespace :assignment do
        resources :agents, only: :index do
          post :assign_driver, on: :member
          post :change_status, on: :collection
        end
      end

      resources :support_requests, only: [:create]

      resources :news, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:index, :create], module: :news do
          member do
            post :comments, action: :create_nested
            post :likes, action: :like
            delete :likes, action: :unlike
          end
        end
        resources :images, only: [:create], module: :news
      end

      get '/documents/kinds', to: 'documents/kinds#index'

      post '/news/images', to: 'news/images#create_unbound'
      get '/news/images/:id', to: 'news/images#image'

      get '/system/status', to: 'system#status'

      get '/invites/:token', to: 'invites#show'
      post '/invites/:token', to: 'invites#update'

      post '/reset_password', to: 'passwords#create'
      post '/reset_password/:token', to: 'passwords#update'
    end
  end
end
