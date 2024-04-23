package com.ssafy.ododoc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododoc.common.TestBase;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestDocs
public class ApiTest extends TestBase {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private DatabaseCleanup databaseCleanup;

    public static final String AUTH_HEADER = "Authorization";

    protected static final String DEFAULT_RESTDOC_PATH = "{class_name}/{method_name}";

    @BeforeEach
    void setUp() {
        if(databaseCleanup.tableNames == null || databaseCleanup.tableNames.isEmpty()) {
            databaseCleanup.afterPropertiesSet();
        }

        databaseCleanup.truncateAllTable();

        // TODO : 로그인 기능 구현 후 로그인 테스트 코드 작성
    }

}
