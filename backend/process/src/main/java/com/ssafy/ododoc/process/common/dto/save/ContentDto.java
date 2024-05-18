package com.ssafy.ododoc.process.common.dto.save;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ContentDto {

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = ContentDto.NonEmptyTextFilter.class)
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
    private HighlightDto highlight;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private String type;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private List<ContentDto> children;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private PropsDto props;

    static class NonEmptyTextFilter {
        @Override
        public boolean equals(Object obj) {
            if (obj == null) {
                return true;
            }
            if (!(obj instanceof ContentDto)) {
                return false;
            }
            ContentDto content = (ContentDto) obj;

            if("link".equals(content.type)) {
                return true;
            }

            return content.text != null && !content.text.isEmpty();
        }
    }
}
