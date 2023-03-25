namespace :bookers do
  desc 'Update assigned_to_all_passengers flag for existing bookers with all passengers selected'
  task update_assigned_to_all_passengers: :environment do
    members = Member
      .active
      .with_active_company
      .exclude(member_role_id: Role[:passenger].id)
      .with(:passenger_counts, DB[:bookers_passengers].group_and_count(:booker_id))
      .left_join(:passenger_counts, booker_id: :users[:id])
      .where(:passenger_counts[:count] > 0)
      .select_append(:passenger_counts[:count].as(:passengers_count))
      .all

    members.each do |member|
      if Passengers::IndexPolicy.scope[member].count == member[:passengers_count]
        DB[:members].where(id: member.id).update(assigned_to_all_passengers: true)
      end
    end
  end
end
