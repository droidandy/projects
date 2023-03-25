package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class TimelineGroupDto {
    private String name;
    private List<TimelineDto> timelines;

    public TimelineGroupDto() {
	}

    public TimelineGroupDto(String name, List<TimelineDto> timelines) {
        this.name = name;
        this.timelines = timelines;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<TimelineDto> getTimelines() {
        return timelines;
    }

    public void setTimelines(List<TimelineDto> timelines) {
        this.timelines = timelines;
    }

}
