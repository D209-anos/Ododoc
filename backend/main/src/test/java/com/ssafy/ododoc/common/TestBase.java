package com.ssafy.ododoc.common;

import com.jayway.jsonpath.JsonPath;
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;

public class TestBase {

    protected <T> T getValueFromJSONBody(MvcResult result, String path, Class<T> targetClass) throws UnsupportedEncodingException {
        String resultString = result.getResponse().getContentAsString();
        Object value = JsonPath.parse(resultString).read(path);
        if (value instanceof Integer && targetClass == Long.class) {
            return targetClass.cast(Long.valueOf((Integer) value));
        }
        return targetClass.cast(value);
    }
}
