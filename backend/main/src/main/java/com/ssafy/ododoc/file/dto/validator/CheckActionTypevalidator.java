package com.ssafy.ododoc.file.dto.validator;

import com.ssafy.ododoc.file.dto.annotation.CheckActionType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CheckActionTypevalidator implements ConstraintValidator<CheckActionType, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        String actionType = value.toUpperCase();

        if(!actionType.equals("SAVE") && !actionType.equals("ADD")) {
            return false;
        }

        return true;
    }
}
