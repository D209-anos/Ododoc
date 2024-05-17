package com.ssafy.ododoc.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class Content {

    private String text;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean bold;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean italic;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean underline;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean strike;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean code;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private Highlight highlight;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private String type;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private List<Content> children;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private Props props;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = Content.NonEmptyTextFilter.class)
    static class NonEmptyTextFilter {
        @Override
        public boolean equals(Object obj) {
            if (obj == null) {
                return true;
            }
            if (!(obj instanceof Content)) {
                return false;
            }
            Content content = (Content) obj;
            return content.text != null && !content.text.isEmpty();
        }
    }
}
