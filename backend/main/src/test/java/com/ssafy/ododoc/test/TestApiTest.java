package com.ssafy.ododoc.test;

import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.test.dto.request.TestRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TestApiTest extends ApiTest {

    @Test
    void helloTest() throws Exception {
        String name = "D209";

        mockMvc.perform(
                get("/test/hello/{name}", name)
                        .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.value").value("Hello " + name))
                .andDo(
                        document(DEFAULT_RESTDOC_PATH, "Swagger 기본 기능을 검증합니다.",
                                "Swagger 검증")
                );
    }

    @Test
    void JPA_Test() throws Exception {
        String gumi = "Gumi";

        test_entity_save("D209", "Gumi JinPeong");
        test_entity_save("Ododoc", "Gumi InDong");

        mockMvc.perform(
                get("/test/jpa/{name}", gumi)
                        .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andDo(handler -> System.out.println(handler.getResponse().getContentAsString()));

    }

    @Test
    void QueryDSL_Test() throws Exception {
        String d209Addr = "Gumi JinPeong";

        test_entity_save("D209", d209Addr);
        test_entity_save("Ododoc", "Gumi InDong");

        MvcResult mvcResult = mockMvc.perform(
                get("/test/querydsl/{name}", "D209")
                        .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andDo(handler -> System.out.println(handler.getResponse().getContentAsString()))
                .andDo(document(DEFAULT_RESTDOC_PATH, "여기에 설명을 적습니다." +
                                "<br>br 태그를 통해 한 칸 띄워적을 수 있습니다." +
                                "<br>지금 내용처럼 설명을 쭉쭉 이어나가면 됩니다." +
                                "<br>아래에는, Document 라는 클래스를 새로 만들고, static 으로 만들어 주면 됩니다. " +
                                "<br>pathField 에 들어가는 required() 는 필요할 때만 넣어 주고, required 가 아닐 경우" +
                                "<br> 뒤에 .optional() 과 같이 써서 반드시 받는 것은 아니라고 표기해 줄 수 있습니다." +
                                "<br>'[]' 는 배열을 표시할 때 사용할 수 있습니다. 배열이 아니라면 그냥 'data.abc' 와 같이" +
                                "<br>기술해 주면 됩니다." +
                                "<br>Header, Query String, Path Parameter, Response 다 따로 나눠 적어줍니다." +
                                "<br>구현이 모두 완료된 것을 처리하는 것이므로, 200, 400, 401, 403, 404, 409.... 등" +
                                "<br>입력을 처리할 때 본인이 상상할 수 있는 모든 케이스를 기술해 주시고, 어떤 케이스에서 어떤" +
                                "<br>Negative Code 가 나가는 지 기술해 주시기 바랍니다.",
                        "Swagger 설명",
                        TestDocument.testPathField, TestDocument.queryDslResponseField
                        ))
                .andReturn();
    }

    void test_entity_save(String name, String address) throws Exception {
        TestRequest request = TestRequest.builder()
                .name(name)
                .address(address)
                .build();

        mockMvc.perform(
                post("/test/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )
                .andExpect(status().isOk());
    }
}
