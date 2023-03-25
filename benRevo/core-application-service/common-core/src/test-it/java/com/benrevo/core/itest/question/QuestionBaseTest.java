package com.benrevo.core.itest.question;

import static io.github.benas.randombeans.api.EnhancedRandom.random;

import com.benrevo.common.dto.QuestionDto;
import com.benrevo.core.AbstractBaseIt;
import java.util.Collections;
import java.util.List;


/**
 * The  Question base test.
 */
public class QuestionBaseTest extends AbstractBaseIt {

    static final Long IDS = 1L;
    List<Long> ids = Collections.singletonList(IDS);
    QuestionDto questionDto = random(QuestionDto.class);
}
