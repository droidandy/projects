package com.benrevo.be.modules.rfp.aop.auth.resolvers;

import com.benrevo.be.modules.rfp.service.FileService;
import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Evgeniy Trishechkin
 */
@Service
public class RfpFileIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private FileService fileService;

    @Autowired
    private RfpIdResolver rfpIdResolver;

    @Override
    public Long resolveClientId(Long fileId) {
        Long rfpId = fileService.getClientFileById(fileId).getRfpId();
        return rfpIdResolver.resolveClientId(rfpId);
    }
}
