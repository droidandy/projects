package com.benrevo.be.modules.shared.aop.auth.resolvers;

public interface ClientIdResolver<T> {

    Long resolveClientId(T parameter);

}
