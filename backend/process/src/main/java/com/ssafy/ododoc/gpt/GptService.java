package com.ssafy.ododoc.gpt;

import com.ssafy.ododoc.gpt.data.GptMessage;
import com.ssafy.ododoc.gpt.dto.GptRequestDto;
import com.ssafy.ododoc.gpt.dto.GptResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GptService {

    private final RestTemplate restTemplate;
    @Value("${openai.api.url}")
    private String apiUrl;

    public GptResponseDto chat(String model, String prompt, String endpointCharged) {
        List<GptMessage> prompts = List.of(
                new GptMessage("user", prompt));
        GptRequestDto request = new GptRequestDto(model, prompts, 1, 256, 1, 0, 0);

        // OpenAI server로 restTemplate을 통해 request를 보내고 response를 받는다.
        GptResponseDto gptResponse = restTemplate
                .postForObject(apiUrl, request, GptResponseDto.class);
        if (gptResponse != null) {
            return gptResponse;
        } else {
            throw new RuntimeException("Error parsing response from OpenAI Server");
        }
    }
}
