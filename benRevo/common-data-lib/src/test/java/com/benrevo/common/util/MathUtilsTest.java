package com.benrevo.common.util;

import static org.junit.Assert.assertEquals;

import com.benrevo.common.enums.ActivityType;
import org.junit.Test;


public class MathUtilsTest {

    @Test
    public void testRoundPositive() {
        assertEquals(48.03, MathUtils.round(48.025, 2), 0.0);
        assertEquals(48.03f, MathUtils.round(48.025f, 2), 0f);
    }
    
    @Test
    public void testRoundNegative() {
        assertEquals(-48.03, MathUtils.round(-48.025, 2), 0.0);
        assertEquals(-48.03f, MathUtils.round(-48.025f, 2), 0f);
    }

}
