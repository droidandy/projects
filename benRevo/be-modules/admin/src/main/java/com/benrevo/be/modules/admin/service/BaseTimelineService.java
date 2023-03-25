package com.benrevo.be.modules.admin.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BaseTimelineService {
	public void removeTimelinesByClientId(Long clientId) {
		// no default implementation
	}
}
