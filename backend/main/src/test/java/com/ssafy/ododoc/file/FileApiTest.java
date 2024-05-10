package com.ssafy.ododoc.file;

import com.ssafy.ododoc.ApiTest;
import com.ssafy.ododoc.common.CommonDocument;
import com.ssafy.ododoc.common.MemberTestUtil;
import com.ssafy.ododoc.common.MockMultipartTestUtil;
import com.ssafy.ododoc.directory.util.DirectoryTestUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.multipart;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class FileApiTest extends ApiTest {

    @Autowired
    private MemberTestUtil memberTestUtil;

    @Autowired
    private DirectoryTestUtil directoryTestUtil;

    @Autowired
    private MockMultipartTestUtil mockMultipartTestUtil;

    @Test
    void 파일_이미지_업로드_성공_200() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andDo(this::print)
                .andDo(document(DEFAULT_RESTDOC_PATH, "파일 내에 이미지를 업로드 하는 API 입니다." +
                                "<br><br><b>multipart/form-data</b> 형식에 맞추어 <b>post 요청</b>해주세요." +
                                "<br><b>header에 올바른 JWT accessToken</b>을 담아 요청 해주세요." +
                                "<br> - 정상 처리 시 response body의 <b>status에 200 OK</b>가, <b>data에 업로드 된 이미지 url</b>이 반환됩니다." +
                                "<br> - directoryId는 <b>1 이상 값</b>을 입력해 주세요. 그렇지 않으면, <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - directoryId에 해당하는 디렉토리가 <b>폴더인 경우</b>, <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - 사진을 <b>입력하지 않은 경우</b>, <b>400 Bad Request</b>가 반환됩니다." +
                                "<br> - <b>header에 JWT accessToken</b>을 입력하지 않으면, <b>401 Unauthorized</b>가 반환됩니다." +
                                "<br> - directoryId에 해당하는 폴더/파일에 <b>접근 권한이 없을 경우</b>, <b>403 Forbidden</b>이 반환됩니다." +
                                "<br> - directoryId에 해당하는 폴더/파일를 <b>찾을 수 없을 경우</b>, <b>404 Not Found</b>가 반환됩니다." +
                                "<br> - directoryId에 해당하는 폴더/파일이 이미 삭제(휴지통, 영구삭제) 되었다면, <b>409 Conflict</b>가 반환됩니다." +
                                "<br> - <b>100MB가 넘는 사진 파일</b> 입력 시, <b>413 Payload Too Large</b>가 반환됩니다." +
                                "<br> - 허용된 사진 파일 확장자가 아닌 <b>다른 확장자의 파일을 입력했을 경우</b>, 415 Unsupported Media Type 이 반환됩니다.",
                        "이미지 업로드", CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields, FileDocument.imageResponseFields
                ));
    }

    @Test
    void 파일_이미지_업로드_잘못된아이디_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long directoryId = -1L;

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_파일아님_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.폴더_생성(token, rootId, mockMvc);

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_사진없음_400() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_토큰없음_401() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(401))
                .andDo(document(DEFAULT_RESTDOC_PATH, FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_권한없음_403() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        String otherToken = memberTestUtil.회원가입_다른유저_토큰반환(mockMvc);

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, otherToken)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(403))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_없는파일_404() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long directoryId = 99999L;

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_삭제된파일_409() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        MockMultipartFile image = mockMultipartTestUtil.이미지_생성();

        directoryTestUtil.디렉토리_삭제_휴지통(token, directoryId, mockMvc);

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(image)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(409))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }

    @Test
    void 파일_이미지_업로드_다른확장자_415() throws Exception {
        String token = memberTestUtil.회원가입_토큰반환(mockMvc);
        Long rootId = memberTestUtil.회원가입_루트아이디_반환(mockMvc);
        Long directoryId = directoryTestUtil.파일_생성(token, rootId, mockMvc);

        MockMultipartFile file = mockMultipartTestUtil.텍스트_파일_생성("textfile", "hello world", "image");

        mockMvc.perform(
                        multipart("/file/image/{directoryId}", directoryId)
                                .file(file)
                                .with(request -> {
                                    request.setMethod("POST");
                                    return request;
                                })
                                .header(AUTH_HEADER, token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(415))
                .andDo(document(DEFAULT_RESTDOC_PATH, CommonDocument.AccessTokenHeader,
                        FileDocument.imagePathFields
                ));
    }
}