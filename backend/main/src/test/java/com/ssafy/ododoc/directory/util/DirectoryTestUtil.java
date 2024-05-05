package com.ssafy.ododoc.directory.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.TestBase;
import com.ssafy.ododoc.directory.DirectorySteps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.delete;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class DirectoryTestUtil extends TestBase {

    @Autowired
    private DirectorySteps directorySteps;

    @Autowired
    protected ObjectMapper objectMapper;

    public final Long rootId = 1L;

    public Long 폴더_생성(String token, MockMvc mockMvc) throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                post("/directory")
                        .header(ApiTest.AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(directorySteps.폴더정보_생성(rootId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andReturn();

        return getValueFromJSONBody(mvcResult, "$.data.id", Long.class);
    }

    public Long 파일_생성(String token, Long parentId, MockMvc mockMvc) throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        post("/directory")
                                .header(ApiTest.AUTH_HEADER, token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(directorySteps.파일정보_생성_이름없음(parentId)))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andReturn();

        return getValueFromJSONBody(mvcResult, "$.data.id", Long.class);
    }

    public void 폴더_삭제_휴지통(String token, Long directoryId, MockMvc mockMvc) throws Exception {
        mockMvc.perform(
                delete("/directory/{option}/{directoryId}", "trashbin", directoryId)
                        .header(ApiTest.AUTH_HEADER, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }

    public void 폴더_삭제_영구(String token, Long directoryId, MockMvc mockMvc) throws Exception {
        mockMvc.perform(
                        delete("/directory/{option}/{directoryId}", "delete", directoryId)
                                .header(ApiTest.AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }
}
