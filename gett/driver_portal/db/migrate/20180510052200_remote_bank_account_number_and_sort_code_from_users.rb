class RemoteBankAccountNumberAndSortCodeFromUsers < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :bank_sort_code, :string
    remove_column :users, :bank_account_number, :string
  end
end
