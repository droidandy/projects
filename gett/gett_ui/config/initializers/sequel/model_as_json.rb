require 'sequel/plugins/json_serializer'
# One-to-one copy-paste of sequel's #to_json method, but without final
# transformation of resulting object to JSON string
Sequel::Plugins::JsonSerializer::InstanceMethods.module_eval do
  def as_json(*args)
    opts = model.json_serializer_opts
    opts = Hash[opts].merge!(@json_serializer_opts) if @json_serializer_opts
    if (arg_opts = args.first).is_a?(Hash)
      opts = Hash[opts].merge!(arg_opts)
    end

    vals = values
    cols =
      if only = opts[:only]
        Array(only)
      else
        vals.keys - Array(opts[:except])
      end

    h = {}

    cols.each{ |c| h[c.to_s] = respond_to?(c) ? public_send(c) : vals[c] }
    if inc = opts[:include]
      if inc.is_a?(Hash)
        inc.each do |k, v|
          if k.is_a?(Sequel::SQL::AliasedExpression)
            key_name = k.aliaz.to_s
            k = k.expression
          else
            key_name = k.to_s
          end

          v = v.empty? ? [] : [v]

          objs = send(k)

          is_array =
            if r = model.association_reflection(k)
              r.returns_array?
            else
              objs.is_a?(Array)
            end

          h[key_name] =
            if is_array
              objs.map{ |obj| obj.as_json(obj, *v) }
            else
              objs.as_json(*v)
            end
        end
      else
        Array(inc).each do |c|
          if c.is_a?(Sequel::SQL::AliasedExpression)
            key_name = c.aliaz.to_s
            c = c.expression
          else
            key_name = c.to_s
          end
          obj = send(c)
          h[key_name] = obj.try(:as_json) || obj
        end
      end
    end

    if root = opts[:root]
      unless root.is_a?(String)
        root = model.send(:underscore, model.send(:demodulize, model.to_s))
      end
      h = {root => h}
    end

    h
  end
end
