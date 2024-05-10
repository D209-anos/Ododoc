package com.ssafy.ododoc.file.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.TestBase;
import com.ssafy.ododoc.file.FileSteps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class FileTestUtil extends TestBase {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FileSteps fileSteps;

    public void 파일_저장(String token, Long directoryId, MockMvc mockMvc) throws Exception {
        mockMvc.perform(
                post("/file/{actionType}", "save")
                        .header(ApiTest.AUTH_HEADER, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fileSteps.저장파일_생성(directoryId)))
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }
}
